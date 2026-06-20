import express from 'express';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';
import { verifyToken } from '../middleware/auth.js'; // Ensure you have this middleware

const router = express.Router();

// GET: fetch recent sales with item counts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT s.SaleID, s.ReceiptNumber, s.TotalAmount, s.UserID, s.TransactionDate,
             IFNULL(SUM(sd.Quantity), 0) AS ItemCount,
             u.Username AS CustomerName
      FROM Sales s
      LEFT JOIN SalesDetails sd ON s.SaleID = sd.SaleID
      LEFT JOIN Users u ON s.UserID = u.UserID
      GROUP BY s.SaleID
      ORDER BY s.TransactionDate DESC
      LIMIT 50
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recent sales' });
  }
});

// Added verifyToken middleware to catch the logged-in user context
router.post('/', verifyToken, async (req, res) => {
  const { items } = req.body;
  const userId = req.user.id; // Extracted safely from your decoded JWT token

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Sale items are required' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let totalAmount = 0;
    const salesDetailsValues = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity < 1) {
        throw new Error('Invalid sale item');
      }

      // Explicitly matching your schema case (ProductID)
      const [productRows] = await connection.query(
        'SELECT ProductID, Price, StockQuantity FROM Products WHERE ProductID = ?',
        [item.productId]
      );
      
      if (!productRows.length) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      const product = productRows[0];
      if (product.StockQuantity < item.quantity) {
        throw new Error(`Insufficient stock for product ${item.productId}`);
      }

      const unitPrice = Number(product.Price);
      const subtotal = unitPrice * item.quantity;
      totalAmount += subtotal;

      // Update product table quantities
      await connection.query(
        'UPDATE Products SET StockQuantity = StockQuantity - ? WHERE ProductID = ?',
        [item.quantity, item.productId]
      );

      // Using an index placeholding 0 for SaleID, to be rewritten later
      salesDetailsValues.push([
        0, 
        item.productId,
        item.quantity,
        unitPrice,
        subtotal,
      ]);
    }

    // Generate unique alpha sequence string
    const receiptNumber = `KRB-${uuidv4().slice(0, 8).toUpperCase()}`;
    
    // FIXED: Appended UserID to the insert query to match your schema requirements
    const [saleResult] = await connection.query(
      'INSERT INTO Sales (ReceiptNumber, TotalAmount, UserID) VALUES (?, ?, ?)',
      [receiptNumber, totalAmount, userId]
    );

    const saleId = saleResult.insertId;

    // Dynamically update the placeholder indexes with the real sale ID
    for (let i = 0; i < salesDetailsValues.length; i += 1) {
      salesDetailsValues[i][0] = saleId;
    }

    // Bulk batch insert the line-items cleanly
    await connection.query(
      'INSERT INTO SalesDetails (SaleID, ProductID, Quantity, UnitPrice, Subtotal) VALUES ?',
      [salesDetailsValues]
    );

    await connection.commit();
    res.status(201).json({ receiptNumber, totalAmount, saleId });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ error: error.message || 'Failed to record sale' });
  } finally {
    connection.release();
  }
});

export default router;