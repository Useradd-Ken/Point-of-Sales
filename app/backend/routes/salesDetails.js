const express = require('express');
const router = express.Router();
const db = require('../db');
const { verifyToken } = require('../middleware/auth');

// GET: Retrieve line-item metrics for a single specific sale record
router.get('/:saleId', verifyToken, async (req, res) => {
    try {
        const [details] = await db.query(`
            SELECT sd.*, p.ProductName 
            FROM SalesDetails sd
            JOIN Products p ON sd.ProductID = p.ProductID
            WHERE sd.SaleID = ?`, 
            [req.params.saleId]
        );
        
        if (details.length === 0) return res.status(404).json({ error: 'Receipt details not found.' });
        res.json(details);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;