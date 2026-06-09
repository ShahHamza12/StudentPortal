import express from 'express';
import { getQuery, runQuery } from '../db/database.js';

const router = express.Router();

// Login endpoint
router.post('/login', async(req, res) => {
    try {
        const { userId, password } = req.body;

        const user = await getQuery(
            'SELECT * FROM users WHERE id = ? AND password = ?', [userId, password]
        );

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Signup endpoint
router.post('/signup', async(req, res) => {
    try {
        const { userId, password, name, role } = req.body;

        // Check if user already exists
        const existing = await getQuery(
            'SELECT * FROM users WHERE id = ?', [userId]
        );

        if (existing) {
            return res.status(400).json({ error: 'User ID already exists!' });
        }

        // Create user
        await runQuery(
            'INSERT INTO users (id, password, name, role) VALUES (?, ?, ?, ?)', [userId, password, name, role]
        );

        // If student, create student record
        if (role === 'student') {
            await runQuery(
                `INSERT INTO students (id, name, total_fees, paid_fees, balance_fees) 
         VALUES (?, ?, ?, ?, ?)`, [userId, name, 125000, 0, 125000]
            );

            const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
            for (const month of months) {
                await runQuery(
                    'INSERT INTO attendance_log (student_id, month, value) VALUES (?, ?, ?)', [userId, month, 0]
                );
            }
        }

        // If teacher, create teacher record
        if (role === 'teacher') {
            await runQuery(
                'INSERT INTO teachers (id, name, department) VALUES (?, ?, ?)', [userId, name, 'Not Assigned']
            );
        }

        res.json({ success: true, message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
