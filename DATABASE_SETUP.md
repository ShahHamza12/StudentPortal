# Student Portal - Database Setup Guide

## 📦 Project Structure

```
STUDENT_PORTAL-main/
├── server/                 # Backend (Node.js + Express)
│   ├── db/
│   │   └── database.js     # SQLite database setup
│   ├── routes/
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── students.js     # Student CRUD endpoints
│   │   └── teachers.js     # Teacher CRUD endpoints
│   ├── package.json
│   └── server.js           # Express server
├── src/                    # Frontend (React + Vite)
│   ├── services/
│   │   └── api.js          # API client
│   └── App.jsx
├── package.json
├── .env                    # Environment configuration
└── vite.config.js
```

## 🚀 Quick Start

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd server
npm install
cd ..
```

### 2. Run the Application

**Option A: Run Both (Frontend + Backend)**
```bash
npm run all
```
This uses concurrently to run both simultaneously.

**Option B: Run Separately**

Terminal 1 (Backend):
```bash
npm run server:start
# or with auto-reload:
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

### 3. Access the Application

- **Frontend:** http://localhost:5173 (Vite default)
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/api/health

## 🗄️ Database

The project uses **SQLite3** for data persistence.

### Tables Created:

1. **users** - Authentication and user info
   - id, password, name, role, created_at

2. **students** - Student information
   - id, name, marks (math, science, cs), attendance, fees info

3. **attendance_log** - Student attendance history
   - id, student_id, month, value

4. **teachers** - Teacher information
   - id, name, department

5. **teacher_schedule** - Teacher class schedule
   - id, teacher_id, day, time, class, room

### Database File:
```
server/db/studentportal.db
```
This file is created automatically on first run.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - Create new user

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get specific student
- `PUT /api/students/:id/marks` - Update marks
- `PUT /api/students/:id/attendance` - Update attendance
- `PUT /api/students/:id/fees` - Update fees
- `POST /api/students/:id/attendance-log` - Add attendance log

### Teachers
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher + schedule
- `PUT /api/teachers/:id` - Update teacher info
- `POST /api/teachers/:id/schedule` - Add schedule
- `DELETE /api/teachers/:id/schedule/:scheduleId` - Delete schedule

## 🔐 Default Credentials

**Admin (Teacher):**
- User ID: `admin`
- Password: `123`

**Sample Student:**
- User ID: `S101`
- Password: `123`

## 🛠️ Backend Features

✅ SQLite Database Integration
✅ RESTful API
✅ CORS Enabled
✅ Error Handling
✅ Auto-seed with sample data
✅ Full CRUD operations

## 📝 Frontend Integration

The frontend now uses the `api.js` service layer to:
- Replace all localStorage calls with API requests
- Manage authentication via backend
- Fetch and update data from the database

Example usage:
```javascript
import { authAPI, studentsAPI } from './services/api.js';

// Login
const user = await authAPI.login('admin', '123');

// Get all students
const students = await studentsAPI.getAll();

// Update marks
await studentsAPI.updateMarks('S101', { math: 90, science: 85, cs: 92 });
```

## 🐛 Troubleshooting

### Port already in use
Change the PORT in server/server.js or set environment variable:
```bash
set PORT=5001
npm run server:start
```

### Database locked error
Delete `server/db/studentportal.db` and restart server to recreate.

### CORS errors
Make sure backend is running on port 5000 and frontend proxy is configured correctly in vite.config.js.

## ✨ Next Steps

1. Update App.jsx to use API calls instead of localStorage
2. Add form validation
3. Add user authentication middleware
4. Deploy to cloud (Azure, Heroku, etc.)
5. Add more features (notifications, file uploads, etc.)

---

Created with ❤️ for Student Portal Database Integration
