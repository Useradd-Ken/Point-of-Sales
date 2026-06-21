import express from 'express';
import pool from '../db.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// 1. GET: Fetch all hoodie products (Removed categories join)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ProductID, ProductName, Price, StockQuantity, ImageURL 
      FROM Products 
      ORDER BY ProductName ASC
    `);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// 2. GET: Fetch a single hoodie by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT ProductID, ProductName, Price, StockQuantity, ImageURL FROM Products WHERE ProductID = ?', 
      [req.params.id]
    );
    
    if (!rows.length) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// 3. POST: Add a new product 
router.post('/', upload.single('image'), async (req, res) => {
  
  // console.log('BODY:', req.body);
  // console.log('FILE:', req.file);

  const { productName, price, stockQuantity } = req.body;

  if (!productName || !price || !stockQuantity) {
    return res.status(400).json({
      error: 'ProductName, Price and StockQuantity are required',
    });
  }

  try {
    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    const [result] = await pool.query(
      `
      INSERT INTO Products
      (ProductName, Price, StockQuantity, ImageURL)
      VALUES (?, ?, ?, ?)
      `,
      [
        productName,
        price,
        stockQuantity,
        imageUrl,
      ]
    );

    res.status(201).json({
      message: 'Product created successfully',
      productId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: 'Failed to create product',
    });
  }
});

// 4. PUT: Edit an existing product 
router.put('/:id', async (req, res) => {
  const { productName, price, stockQuantity, imageUrl } = req.body;
  try {
    const [result] = await pool.query(
      'UPDATE Products SET ProductName = ?, Price = ?, StockQuantity = ?, ImageURL = ? WHERE ProductID = ?',
      [productName, price, stockQuantity, imageUrl, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// 5. DELETE: Remove a product 
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM Products WHERE ProductID = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Cannot delete product linked to historic sales logs.' });
  }
});

export default router;