import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js'; 

const router = express.Router();

// POST: Login User
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Changed 'db.query' to 'pool.query' to match your imported variable
        const [users] = await pool.query('SELECT * FROM Users WHERE Username = ?', [username]);
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

        const user = users[0];
        
        const isMatch = await bcrypt.compare(password, user.Password);
        if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

        // Sign token containing ID and Role
        const token = jwt.sign(
            { id: user.UserID, role: user.Role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '8h' }
        );
        
        res.json({ 
            token, 
            user: { id: user.UserID, username: user.Username, role: user.Role } 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router; 