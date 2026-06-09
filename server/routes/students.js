import express from 'express';
import { getQuery, allQuery, runQuery } from '../db/database.js';

const router = express.Router();

const normalizeStudent = (student, attendanceLog = []) => ({
    id: student.id,
    name: student.name,
    marks: {
        Math: student.math_marks,
        Science: student.science_marks,
        CS: student.cs_marks
    },
    attendance: student.attendance,
    fees: {
        total: student.total_fees,
        paid: student.paid_fees,
        balance: student.balance_fees
    },
    attendanceLog
});

const getStudentWithLog = async(id) => {
    const student = await getQuery('SELECT * FROM students WHERE id = ?', [id]);

    if (!student) return null;

    const attendanceLog = await allQuery(
        'SELECT month, value FROM attendance_log WHERE student_id = ? ORDER BY id', [id]
    );

    return normalizeStudent(student, attendanceLog);
};

// Get all students
router.get('/', async(req, res) => {
    try {
        const students = await allQuery('SELECT * FROM students ORDER BY id');
        const formattedStudents = await Promise.all(
            students.map((student) => getStudentWithLog(student.id))
        );
        res.json(formattedStudents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add a student from teacher dashboard
router.post('/', async(req, res) => {
    try {
        const { id, name, attendance = 0 } = req.body;

        if (!id || !name) {
            return res.status(400).json({ error: 'Student ID and name are required' });
        }

        const existing = await getQuery('SELECT id FROM users WHERE id = ?', [id]);
        if (existing) {
            return res.status(400).json({ error: 'Student ID already exists!' });
        }

        await runQuery(
            'INSERT INTO users (id, password, name, role) VALUES (?, ?, ?, ?)', [id, '123', name, 'student']
        );

        await runQuery(
            `INSERT INTO students 
       (id, name, math_marks, science_marks, cs_marks, attendance, total_fees, paid_fees, balance_fees) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [id, name, 0, 0, 0, attendance, 125000, 0, 125000]
        );

        const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
        for (const month of months) {
            await runQuery(
                'INSERT INTO attendance_log (student_id, month, value) VALUES (?, ?, ?)', [id, month, attendance]
            );
        }

        const created = await getStudentWithLog(id);
        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single student with attendance log
router.get('/:id', async(req, res) => {
    try {
        const student = await getStudentWithLog(req.params.id);

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update student marks
router.put('/:id/marks', async(req, res) => {
    try {
        const { math, science, cs, Math, Science, CS } = req.body;
        const { id } = req.params;

        await runQuery(
            `UPDATE students 
       SET math_marks = ?, science_marks = ?, cs_marks = ? 
       WHERE id = ?`, [math ?? Math ?? 0, science ?? Science ?? 0, cs ?? CS ?? 0, id]
        );

        const updated = await getStudentWithLog(id);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update student attendance
router.put('/:id/attendance', async(req, res) => {
    try {
        const { attendance } = req.body;
        const { id } = req.params;

        await runQuery(
            'UPDATE students SET attendance = ? WHERE id = ?', [attendance, id]
        );

        const updated = await getStudentWithLog(id);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update student fees
router.put('/:id/fees', async(req, res) => {
    try {
        const { paid } = req.body;
        const { id } = req.params;

        const student = await getQuery('SELECT * FROM students WHERE id = ?', [id]);
        const balance = student.total_fees - paid;

        await runQuery(
            `UPDATE students 
       SET paid_fees = ?, balance_fees = ? 
       WHERE id = ?`, [paid, balance, id]
        );

        const updated = await getStudentWithLog(id);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add attendance log entry
router.post('/:id/attendance-log', async(req, res) => {
    try {
        const { month, value } = req.body;
        const { id } = req.params;

        if (!month) {
            return res.status(400).json({ error: 'Month is required' });
        }

        const current = await getQuery(
            'SELECT id FROM attendance_log WHERE student_id = ? AND month = ?', [id, month]
        );

        if (current) {
            await runQuery(
                'UPDATE attendance_log SET value = ? WHERE id = ?', [value, current.id]
            );
        } else {
            await runQuery(
                'INSERT INTO attendance_log (student_id, month, value) VALUES (?, ?, ?)', [id, month, value]
            );
        }

        const logs = await allQuery(
            'SELECT month, value FROM attendance_log WHERE student_id = ? ORDER BY id', [id]
        );

        const average = logs.length ?
            Math.round(logs.reduce((total, log) => total + Number(log.value), 0) / logs.length) :
            Number(value) || 0;

        await runQuery(
            'UPDATE students SET attendance = ? WHERE id = ?', [average, id]
        );

        const updated = await getStudentWithLog(id);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
