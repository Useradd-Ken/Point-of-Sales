import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.ProductID, p.CategoryID, p.ProductName, p.Price, p.StockQuantity, p.ImageURL, c.CategoryName
      FROM Products p
      JOIN Categories c ON p.CategoryID = c.CategoryID
      ORDER BY c.CategoryName, p.ProductName
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Products WHERE ProductID = ?', [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.post('/sale', async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({ error: 'Product ID and quantity are required' });
  }

  try {
    const [products] = await pool.query('SELECT ProductID, StockQuantity, Price FROM Products WHERE ProductID = ?', [productId]);
    if (!products.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];
    if (product.StockQuantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    await pool.query('UPDATE Products SET StockQuantity = StockQuantity - ? WHERE ProductID = ?', [quantity, productId]);
    res.json({ success: true, remainingStock: product.StockQuantity - quantity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update stock' });
  }
});

export default router;
