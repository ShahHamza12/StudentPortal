import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'studentportal.db');

export const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database at:', dbPath);
    }
});

// Promisify database operations
export const runQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.run(query, params, function(err) {
            if (err) reject(err);
            else resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
};

export const getQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

export const allQuery = (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows || []);
        });
    });
};

export const initializeDatabase = () => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            // Create Users table
            db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          password TEXT NOT NULL,
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
                if (err) console.error('Error creating users table:', err);
            });

            // Create Students table
            db.run(`
        CREATE TABLE IF NOT EXISTS students (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          math_marks INTEGER DEFAULT 0,
          science_marks INTEGER DEFAULT 0,
          cs_marks INTEGER DEFAULT 0,
          attendance INTEGER DEFAULT 0,
          total_fees INTEGER DEFAULT 125000,
          paid_fees INTEGER DEFAULT 0,
          balance_fees INTEGER DEFAULT 125000,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(id) REFERENCES users(id)
        )
      `, (err) => {
                if (err) console.error('Error creating students table:', err);
            });

            // Create Student Attendance Log table
            db.run(`
        CREATE TABLE IF NOT EXISTS attendance_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          student_id TEXT NOT NULL,
          month TEXT NOT NULL,
          value INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(student_id) REFERENCES students(id)
        )
      `, (err) => {
                if (err) console.error('Error creating attendance_log table:', err);
            });

            // Create Teachers table
            db.run(`
        CREATE TABLE IF NOT EXISTS teachers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          department TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(id) REFERENCES users(id)
        )
      `, (err) => {
                if (err) console.error('Error creating teachers table:', err);
            });

            // Create Teacher Schedule table
            db.run(`
        CREATE TABLE IF NOT EXISTS teacher_schedule (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          teacher_id TEXT NOT NULL,
          day TEXT NOT NULL,
          time TEXT NOT NULL,
          class TEXT NOT NULL,
          room TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(teacher_id) REFERENCES teachers(id)
        )
      `, (err) => {
                if (err) console.error('Error creating teacher_schedule table:', err);
                else {
                    console.log('Database tables initialized successfully');
                    seedInitialData()
                        .then(seedAttendanceLogs)
                        .then(resolve)
                        .catch(reject);
                }
            });
        });
    });
};

// Seed initial data
const seedInitialData = async() => {
    try {
        // Check if admin already exists
        const admin = await getQuery('SELECT * FROM users WHERE id = ?', ['admin']);
        if (admin) {
            console.log('Database already seeded');
            return;
        }

        // Insert admin user
        await runQuery(
            'INSERT INTO users (id, password, name, role) VALUES (?, ?, ?, ?)', ['admin', '123', 'Prof. Rajesh Sharma', 'teacher']
        );

        // Insert students
        const students = [
            { id: 'S101', name: 'Rahul Kumar', math: 85, science: 78, cs: 92, attendance: 88 },
            { id: 'S102', name: 'Priya Sharma', math: 72, science: 90, cs: 85, attendance: 92 },
            { id: 'S103', name: 'Amit Singh', math: 65, science: 70, cs: 80, attendance: 75 },
            { id: 'S104', name: 'Sanya Roy', math: 95, science: 98, cs: 99, attendance: 98 },
            { id: 'S105', name: 'Vikram Aditya', math: 80, science: 82, cs: 88, attendance: 85 },
            { id: 'S106', name: 'Anjali Verma', math: 70, science: 65, cs: 75, attendance: 80 },
            { id: 'S107', name: 'Arjun Mehra', math: 88, science: 85, cs: 90, attendance: 90 },
            { id: 'S108', name: 'Ishani Gupta', math: 78, science: 80, cs: 82, attendance: 82 },
            { id: 'S109', name: 'Rohan Das', math: 92, science: 88, cs: 95, attendance: 95 },
            { id: 'S110', name: 'Kavya Iyer', math: 84, science: 86, cs: 88, attendance: 86 }
        ];

        for (const student of students) {
            // Create user
            await runQuery(
                'INSERT INTO users (id, password, name, role) VALUES (?, ?, ?, ?)', [student.id, '123', student.name, 'student']
            );

            // Create student record
            const balance = 125000 - 85000; // Example: default 85000 paid
            await runQuery(
                `INSERT INTO students 
         (id, name, math_marks, science_marks, cs_marks, attendance, total_fees, paid_fees, balance_fees) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [student.id, student.name, student.math, student.science, student.cs, student.attendance, 125000, 85000, balance]
            );
        }

        // Insert teacher record
        await runQuery(
            'INSERT INTO teachers (id, name, department) VALUES (?, ?, ?)', ['admin', 'Prof. Rajesh Sharma', 'AI & Data Science']
        );

        // Insert teacher schedule
        const schedule = [
            ['admin', 'Monday', '10:00 AM', 'B.Tech CS-4A', '302'],
            ['admin', 'Tuesday', '11:30 AM', 'B.Tech AI-1A', '101'],
            ['admin', 'Wednesday', '02:00 PM', 'B.Tech AI-2B', 'Lab 5'],
            ['admin', 'Thursday', '10:00 AM', 'B.Tech CS-4A', '302'],
            ['admin', 'Friday', '11:00 AM', 'B.Tech CS-3C', '401'],
            ['admin', 'Saturday', '09:30 AM', 'Data Science Seminar', 'Audi-1']
        ];

        for (const s of schedule) {
            await runQuery(
                'INSERT INTO teacher_schedule (teacher_id, day, time, class, room) VALUES (?, ?, ?, ?, ?)',
                s
            );
        }

        console.log('Initial data seeded successfully');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

const seedAttendanceLogs = async() => {
    const students = await allQuery('SELECT id, attendance FROM students ORDER BY id');
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];

    for (const student of students) {
        const existingLogs = await allQuery(
            'SELECT month FROM attendance_log WHERE student_id = ?', [student.id]
        );
        const existingMonths = new Set(existingLogs.map((log) => log.month));

        for (const [index, month] of months.entries()) {
            if (existingMonths.has(month)) continue;

            const offset = index - 2;
            const value = Math.max(0, Math.min(100, Number(student.attendance) + offset));

            await runQuery(
                'INSERT INTO attendance_log (student_id, month, value) VALUES (?, ?, ?)', [student.id, month, value]
            );
        }
    }
};
