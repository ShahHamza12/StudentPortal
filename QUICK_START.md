# 🎓 Student Portal - SQL Database Integration Guide

## 📊 What's New

Your Student Portal now has a **full SQL database backend** for persistent data storage!

### ✨ New Features:
- ✅ **SQLite Database** - Stores all student, teacher, and user data
- ✅ **Express.js Backend** - RESTful API for all operations  
- ✅ **Full CRUD Operations** - Create, Read, Update, Delete data
- ✅ **Multiple Tables** - Organized data structure
- ✅ **Authentication** - Login/Signup system
- ✅ **Auto-sync** - Data persists between sessions

---

## 🏗️ New Project Structure

```
STUDENT_PORTAL-main/
│
├── 📁 server/                    ← NEW: Backend Server
│   ├── 📁 db/
│   │   ├── database.js           (SQLite setup & queries)
│   │   └── studentportal.db      (Database file - auto-created)
│   │
│   ├── 📁 routes/
│   │   ├── auth.js               (Login/Signup endpoints)
│   │   ├── students.js           (Student CRUD operations)
│   │   └── teachers.js           (Teacher CRUD operations)
│   │
│   ├── server.js                 (Express app)
│   └── package.json              (Backend dependencies)
│
├── 📁 src/
│   ├── 📁 services/
│   │   └── api.js                ← NEW: API Client
│   └── App.jsx
│
├── package.json                  ← UPDATED
├── vite.config.js                ← UPDATED
├── .env                          ← NEW: Configuration
├── setup.bat                      ← NEW: Windows Setup
├── setup.sh                       ← NEW: Linux/Mac Setup
├── DATABASE_SETUP.md              ← Complete docs
└── QUICK_START.md                (This file)
```

---

## 🚀 Getting Started (2 Minutes)

### Step 1️⃣: Install Dependencies
```bash
# Option A: Automatic Setup (Recommended)
setup.bat              # For Windows (just double-click)
# OR
bash setup.sh          # For Mac/Linux

# Option B: Manual Setup
npm install
cd server
npm install
cd ..
```

### Step 2️⃣: Run the Application
```bash
# Run both backend + frontend together
npm run all

# OR run separately (in different terminals):
# Terminal 1:
npm run server

# Terminal 2:
npm run dev
```

### Step 3️⃣: Access the App
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

---

## 💻 Default Login Credentials

### Admin/Teacher Account:
```
User ID: admin
Password: 123
```

### Sample Student Account:
```
User ID: S101
Password: 123
(And S102-S110 with same password)
```

---

## 🗄️ Database Tables

### 1. **users** - Authentication & User Info
```sql
id (PRIMARY KEY)        -- User ID (admin, S101, etc)
password                -- Password
name                    -- Full Name
role                    -- 'student' or 'teacher'
created_at              -- Timestamp
```

### 2. **students** - Student Information
```sql
id (PRIMARY KEY)        -- Student ID (S101, S102, etc)
name                    -- Student Name
math_marks              -- Mathematics score
science_marks           -- Science score
cs_marks                -- Computer Science score
attendance              -- Attendance percentage
total_fees              -- Total fees amount (₹)
paid_fees               -- Amount paid
balance_fees            -- Outstanding balance
created_at              -- Timestamp
```

### 3. **attendance_log** - Monthly Attendance History
```sql
id (PRIMARY KEY)        -- Auto-increment
student_id              -- Foreign key to students
month                   -- Month (JAN, FEB, etc)
value                   -- Attendance percentage
created_at              -- Timestamp
```

### 4. **teachers** - Teacher Information
```sql
id (PRIMARY KEY)        -- Teacher ID
name                    -- Teacher Name
department              -- Department
created_at              -- Timestamp
```

### 5. **teacher_schedule** - Class Schedule
```sql
id (PRIMARY KEY)        -- Auto-increment
teacher_id              -- Foreign key to teachers
day                     -- Day of week
time                    -- Class time
class                   -- Class name
room                    -- Room/Lab number
created_at              -- Timestamp
```

---

## 📡 API Endpoints Reference

### Authentication
```
POST   /api/auth/login
POST   /api/auth/signup
```

### Students
```
GET    /api/students              → Get all students
GET    /api/students/:id          → Get specific student
PUT    /api/students/:id/marks    → Update marks
PUT    /api/students/:id/attendance → Update attendance
PUT    /api/students/:id/fees     → Update fees paid
POST   /api/students/:id/attendance-log → Add attendance record
```

### Teachers
```
GET    /api/teachers              → Get all teachers
GET    /api/teachers/:id          → Get teacher + schedule
PUT    /api/teachers/:id          → Update teacher info
POST   /api/teachers/:id/schedule → Add class schedule
DELETE /api/teachers/:id/schedule/:scheduleId → Remove schedule
```

---

## 💡 Usage Examples

### In Your React Code

#### Option 1: Using the API Service (Recommended)
```javascript
import { authAPI, studentsAPI, teachersAPI } from './services/api.js';

// Login
const user = await authAPI.login('admin', '123');

// Get all students
const students = await studentsAPI.getAll();

// Update student marks
await studentsAPI.updateMarks('S101', { 
  math: 95, 
  science: 90, 
  cs: 92 
});

// Get teacher with schedule
const teacher = await teachersAPI.getOne('admin');

// Add new class schedule
await teachersAPI.addSchedule('admin', {
  day: 'Monday',
  time: '09:00 AM',
  className: 'B.Tech CS-5A',
  room: '305'
});
```

#### Option 2: Direct Fetch (If Needed)
```javascript
// Login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ userId: 'admin', password: '123' })
});
const user = await response.json();
```

---

## 🔧 Common Tasks

### ✏️ Update App.jsx to Use Database

**Before (localStorage):**
```javascript
const [db, setDb] = useState({ users: [], students: [], teachers: [] });

useEffect(() => {
  const savedData = localStorage.getItem('eduportal_master_db');
  if (savedData) setDb(JSON.parse(savedData));
}, []);
```

**After (Database):**
```javascript
import { studentsAPI, authAPI } from './services/api.js';

useEffect(() => {
  const loadData = async () => {
    try {
      const students = await studentsAPI.getAll();
      setDb({ students, users: [], teachers: [] });
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  };
  loadData();
}, []);
```

### 🔒 Check Server Health
```bash
curl http://localhost:5000/api/health
```
Expected response:
```json
{
  "status": "Server is running",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### 🗑️ Reset Database
```bash
# Stop the server
# Delete the database file
rm server/db/studentportal.db    # Mac/Linux
del server\db\studentportal.db   # Windows

# Restart server - it will auto-create with fresh data
npm run server
```

---

## ⚙️ Configuration

### Change Backend Port
Edit `server/server.js`:
```javascript
const PORT = process.env.PORT || 5000;  // Change 5000 to desired port
```

### Change API URL
Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Port 5000 already in use** | `set PORT=5001 && npm run server` |
| **Database locked error** | Delete `server/db/studentportal.db` and restart |
| **CORS errors** | Verify backend is running and vite.config.js proxy is set |
| **Can't connect to backend** | Check if backend is running on terminal 1 |
| **npm command not found** | Install Node.js from nodejs.org |

---

## ✅ Next Steps

1. ✅ **Install & Run** - Get everything working
2. 🔄 **Replace localStorage** - Update App.jsx to use api.js
3. 🧪 **Test all features** - Try login, create users, update data
4. 🎨 **Add more features** - File uploads, notifications, etc.
5. 🚀 **Deploy** - Azure, Heroku, or your chosen platform

---

## 📚 File References

- **Backend Setup:** See `DATABASE_SETUP.md` for complete documentation
- **API Service:** [src/services/api.js](src/services/api.js)
- **Server Entry:** [server/server.js](server/server.js)
- **Database Schema:** [server/db/database.js](server/db/database.js)

---

## 🎯 Key Points to Remember

- 💾 All data is now in **SQLite database** - survives app restarts
- 🔄 Make HTTP requests to **http://localhost:5000/api** endpoints
- 📦 Use the `api.js` service for clean, organized API calls
- 🛡️ Backend runs on **port 5000**, Frontend on **port 5173**
- 🌐 CORS is enabled - frontend can safely call backend

---

## 💬 Questions?

Refer to `DATABASE_SETUP.md` for comprehensive documentation on:
- Database structure
- All API endpoints
- Detailed troubleshooting
- Architecture overview

**Happy coding! 🚀**
