import express from 'express';
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
        
                if (password !== user.Password) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                const jwtSecret = process.env.JWT_SECRET || 'dev-secret';
                if (!process.env.JWT_SECRET) {
                    console.warn('JWT_SECRET is not set. Using insecure fallback secret for development.');
                }

                // Sign token containing ID and Role
                const token = jwt.sign(
                        { id: user.UserID, role: user.Role }, 
                        jwtSecret, 
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