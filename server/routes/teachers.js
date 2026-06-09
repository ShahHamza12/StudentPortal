import express from 'express';
import { getQuery, allQuery, runQuery } from '../db/database.js';

const router = express.Router();

const getTeacherWithSchedule = async(id) => {
    const teacher = await getQuery(
        'SELECT * FROM teachers WHERE id = ?', [id]
    );

    if (!teacher) return null;

    const schedule = await allQuery(
        'SELECT id, day, time, class, room FROM teacher_schedule WHERE teacher_id = ? ORDER BY id', [id]
    );

    return {...teacher, schedule };
};

// Get all teachers
router.get('/', async(req, res) => {
    try {
        const teachers = await allQuery('SELECT * FROM teachers ORDER BY id');
        const formattedTeachers = await Promise.all(
            teachers.map((teacher) => getTeacherWithSchedule(teacher.id))
        );
        res.json(formattedTeachers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get single teacher with schedule
router.get('/:id', async(req, res) => {
    try {
        const teacher = await getTeacherWithSchedule(req.params.id);

        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        res.json(teacher);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update teacher info
router.put('/:id', async(req, res) => {
    try {
        const { name, department } = req.body;
        const { id } = req.params;

        await runQuery(
            'UPDATE teachers SET name = ?, department = ? WHERE id = ?', [name, department, id]
        );

        const updated = await getTeacherWithSchedule(id);
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add schedule entry
router.post('/:id/schedule', async(req, res) => {
    try {
        const { day, time, className, room } = req.body;
        const { id } = req.params;

        await runQuery(
            'INSERT INTO teacher_schedule (teacher_id, day, time, class, room) VALUES (?, ?, ?, ?, ?)', [id, day, time, className, room]
        );

        const schedule = await allQuery(
            'SELECT id, day, time, class, room FROM teacher_schedule WHERE teacher_id = ? ORDER BY id', [id]
        );

        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete schedule entry
router.delete('/:id/schedule/:scheduleId', async(req, res) => {
    try {
        const { id, scheduleId } = req.params;

        await runQuery(
            'DELETE FROM teacher_schedule WHERE id = ? AND teacher_id = ?', [scheduleId, id]
        );

        const schedule = await allQuery(
            'SELECT id, day, time, class, room FROM teacher_schedule WHERE teacher_id = ? ORDER BY id', [id]
        );

        res.json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
