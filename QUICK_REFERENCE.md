# ⚡ Quick Reference Card - Student Portal Database

## 🎯 Start Here (30 seconds)

```bash
# Windows Users: Double-click this
setup.bat

# Mac/Linux Users: Run this
bash setup.sh

# Then run this in any terminal:
npm run all
```

**Access:** http://localhost:5173

---

## 👤 Login Credentials

| Role | User ID | Password |
|------|---------|----------|
| Admin/Teacher | admin | 123 |
| Student | S101 | 123 |
| Student | S102-S110 | 123 |

---

## 📡 API Quick Reference

```javascript
import { authAPI, studentsAPI, teachersAPI } from './services/api.js';

// ========== AUTH ==========
await authAPI.login('admin', '123');
await authAPI.signup('S111', '123', 'John Doe', 'student');

// ========== STUDENTS ==========
await studentsAPI.getAll();                           // Get all
await studentsAPI.getOne('S101');                     // Get one
await studentsAPI.updateMarks('S101', {               // Update marks
  math: 95, 
  science: 90, 
  cs: 92 
});
await studentsAPI.updateAttendance('S101', 88);       // Update attendance
await studentsAPI.updateFees('S101', 100000);         // Update fees paid
await studentsAPI.addAttendanceLog('S101', 'JAN', 80);// Add monthly record

// ========== TEACHERS ==========
await teachersAPI.getAll();                           // Get all
await teachersAPI.getOne('admin');                    // Get one + schedule
await teachersAPI.update('admin', {                   // Update info
  name: 'Prof. Name',
  department: 'Computer Science'
});
await teachersAPI.addSchedule('admin', {              // Add schedule
  day: 'Monday',
  time: '10:00 AM',
  className: 'B.Tech CS-5A',
  room: '305'
});
await teachersAPI.deleteSchedule('admin', 1);        // Delete schedule
```

---

## 🗄️ Database Tables at a Glance

```sql
-- Users (for login)
users: id, password, name, role, created_at

-- Student Info
students: id, name, math_marks, science_marks, cs_marks, 
          attendance, total_fees, paid_fees, balance_fees, created_at

-- Student Attendance History
attendance_log: id, student_id, month, value, created_at

-- Teacher Info
teachers: id, name, department, created_at

-- Teacher Schedule
teacher_schedule: id, teacher_id, day, time, class, room, created_at
```

---

## 🔄 Running Commands

| Task | Command |
|------|---------|
| **Install All** | `setup.bat` (Windows) or `bash setup.sh` (Mac/Linux) |
| **Run Both** | `npm run all` |
| **Run Backend Only** | `npm run server` or `npm run server:start` |
| **Run Frontend Only** | `npm run dev` |
| **Build Frontend** | `npm run build` |
| **Lint Code** | `npm run lint` |

---

## 🔗 Important URLs

```
Frontend:        http://localhost:5173
Backend:         http://localhost:5000
API Health:      http://localhost:5000/api/health
Database:        server/db/studentportal.db (file-based)
```

---

## 📊 HTTP Methods by Endpoint Type

```
LOGIN/SIGNUP:
  POST /api/auth/login
  POST /api/auth/signup

STUDENTS (All GET, some PUT/POST):
  GET    /api/students
  GET    /api/students/:id
  PUT    /api/students/:id/marks
  PUT    /api/students/:id/attendance
  PUT    /api/students/:id/fees
  POST   /api/students/:id/attendance-log

TEACHERS (GET, PUT, POST, DELETE):
  GET    /api/teachers
  GET    /api/teachers/:id
  PUT    /api/teachers/:id
  POST   /api/teachers/:id/schedule
  DELETE /api/teachers/:id/schedule/:scheduleId
```

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| **Port in use** | `set PORT=5001 && npm run server` (Windows) |
| **Can't find npm** | Install Node.js from nodejs.org |
| **Backend won't start** | Delete `server/node_modules` and run `cd server && npm install` |
| **Database error** | Delete `server/db/studentportal.db` and restart |
| **CORS error** | Ensure backend is running on port 5000 |
| **Frontend not loading** | Check http://localhost:5173 in browser |

---

## 📁 Key Files Location

| File | Purpose |
|------|---------|
| `src/services/api.js` | API client |
| `server/server.js` | Backend entry |
| `server/db/database.js` | Database setup |
| `server/db/studentportal.db` | Data file |
| `.env` | Config |
| `vite.config.js` | Frontend build config |

---

## 🎓 Next Steps

1. ✅ **Run setup.bat** (already done in installation)
2. ✅ **Start servers** with `npm run all`
3. 📝 **Update App.jsx** to use API instead of localStorage
4. 🧪 **Test** all features with real database
5. 🚀 **Deploy** when ready

---

## 💡 Code Examples

### Login User
```javascript
try {
  const user = await authAPI.login('admin', '123');
  console.log('Logged in:', user);
} catch (error) {
  console.error('Login failed:', error.message);
}
```

### Update Student Marks
```javascript
const updated = await studentsAPI.updateMarks('S101', {
  math: 95,
  science: 88,
  cs: 92
});
console.log('Updated:', updated);
```

### Get Teacher Schedule
```javascript
const teacher = await teachersAPI.getOne('admin');
teacher.schedule.forEach(s => {
  console.log(`${s.day}: ${s.class} at ${s.room}`);
});
```

---

## ✨ Features Available

✅ SQL Database (SQLite)
✅ RESTful API (14 endpoints)
✅ User Authentication
✅ Student Management
✅ Teacher Management  
✅ Attendance Tracking
✅ Fee Management
✅ Schedule Management
✅ Persistent Data Storage
✅ Cross-platform (Windows/Mac/Linux)

---

## 📞 Documentation Links

- **Quick Start:** QUICK_START.md
- **Complete Docs:** DATABASE_SETUP.md
- **Architecture:** ARCHITECTURE.md
- **This Reference:** QUICK_REFERENCE.md

---

**Ready? Run `npm run all` and start coding! 🚀**
