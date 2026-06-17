import express from 'express';
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

router.post('/', async (req, res) => {
  const { items } = req.body;

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

      await connection.query(
        'UPDATE Products SET StockQuantity = StockQuantity - ? WHERE ProductID = ?',
        [item.quantity, item.productId]
      );

      salesDetailsValues.push([
        0,
        item.productId,
        item.quantity,
        unitPrice,
        subtotal,
      ]);
    }

    const receiptNumber = `POS-${uuidv4().slice(0, 8).toUpperCase()}`;
    const [saleResult] = await connection.query(
      'INSERT INTO Sales (ReceiptNumber, TotalAmount) VALUES (?, ?)',
      [receiptNumber, totalAmount]
    );

    const saleId = saleResult.insertId;

    // update SaleID values after the sale insert
    for (let i = 0; i < salesDetailsValues.length; i += 1) {
      salesDetailsValues[i][0] = saleId;
    }

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
