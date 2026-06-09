# 📁 Complete Project Structure with Database

```
STUDENT_PORTAL-main/
│
├── 📄 setup.bat                    ← Windows: Run this first (double-click)
├── 📄 setup.sh                     ← Mac/Linux: bash setup.sh
├── 📄 .env                         ← API configuration
│
├── 📄 package.json                 ✏️ UPDATED - Added server scripts
├── 📄 vite.config.js               ✏️ UPDATED - Added API proxy
├── 📄 eslint.config.js
├── 📄 postcss.config.js
├── 📄 tailwind.config.js
│
├── 📚 README.md                    (Original)
├── 📚 QUICK_START.md               ⭐ START HERE
├── 📚 DATABASE_SETUP.md            Complete documentation
├── 📚 ARCHITECTURE.md              System diagrams & flow
├── 📚 SUMMARY.md                   This implementation summary
│
├── 📁 public/                      (Static files)
│
├── 📁 src/                         Frontend Source
│   ├── 📄 main.jsx                 
│   ├── 📄 App.jsx                  Main component
│   ├── 📄 App.css
│   ├── 📄 index.css
│   │
│   ├── 📁 services/                ⭐ NEW
│   │   └── 📄 api.js               API client for making requests
│   │
│   └── 📁 assets/                  Images, icons, etc.
│
└── 📁 server/                      ⭐ NEW - Backend Server
    │
    ├── 📄 server.js                Express app entry point
    ├── 📄 package.json             Backend dependencies
    │
    ├── 📁 db/                      Database
    │   ├── 📄 database.js          SQLite setup & helpers
    │   └── 📄 studentportal.db     Database file (auto-created)
    │
    └── 📁 routes/                  API Endpoints
        ├── 📄 auth.js              /api/auth/*
        ├── 📄 students.js          /api/students/*
        └── 📄 teachers.js          /api/teachers/*
```

---

## 📊 What's New vs What's Existing

### ✅ Files Created (NEW)
```
✨ NEW Backend Folder:
   server/
   ├── server.js
   ├── package.json
   ├── db/database.js
   ├── db/studentportal.db (created at runtime)
   ├── routes/auth.js
   ├── routes/students.js
   └── routes/teachers.js

✨ NEW Frontend Services:
   src/services/api.js

✨ NEW Configuration & Setup:
   .env
   setup.bat
   setup.sh

✨ NEW Documentation:
   QUICK_START.md
   DATABASE_SETUP.md
   ARCHITECTURE.md
   SUMMARY.md
   STRUCTURE.md (this file)
```

### ✏️ Files Modified (UPDATED)
```
package.json
- Added "server": "cd server && npm install && npm run dev"
- Added "server:start": "cd server && npm start"
- Added "all": "concurrently \"npm run server\" \"npm run dev\""
- Added "concurrently": "^8.2.1" dependency

vite.config.js
- Added server.proxy configuration for API
```

### 📄 Files Unchanged (EXISTING)
```
- src/App.jsx
- src/main.jsx
- src/App.css
- src/index.css
- public/*
- README.md
- eslint.config.js
- postcss.config.js
- tailwind.config.js
- index.html
```

---

## 🚀 File-by-File Explanation

### Backend Files

#### `server/server.js` 
- Main Express application
- Initializes database
- Sets up CORS
- Mounts all routes
- Listens on port 5000

#### `server/package.json`
- Backend dependencies:
  - express (web framework)
  - sqlite3 (database driver)
  - cors (cross-origin support)
  - dotenv (environment variables)

#### `server/db/database.js`
- SQLite3 connection setup
- Creates all 5 tables on startup
- Database helper functions:
  - `runQuery()` - INSERT/UPDATE/DELETE
  - `getQuery()` - SELECT single row
  - `allQuery()` - SELECT multiple rows
- Auto-seeds with initial data

#### `server/routes/auth.js`
- `POST /api/auth/login` - Verify credentials
- `POST /api/auth/signup` - Create new user

#### `server/routes/students.js`
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get one student
- `PUT /api/students/:id/marks` - Update marks
- `PUT /api/students/:id/attendance` - Update attendance
- `PUT /api/students/:id/fees` - Update fees
- `POST /api/students/:id/attendance-log` - Add monthly attendance

#### `server/routes/teachers.js`
- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher + schedule
- `PUT /api/teachers/:id` - Update teacher
- `POST /api/teachers/:id/schedule` - Add schedule
- `DELETE /api/teachers/:id/schedule/:scheduleId` - Delete schedule

### Frontend Files

#### `src/services/api.js` (NEW)
- Exports: `API_URL` constant
- Functions: `apiCall()` helper for fetch
- Organized API methods:
  - `authAPI` - login, signup
  - `studentsAPI` - all student operations
  - `teachersAPI` - all teacher operations

#### `.env`
```
VITE_API_URL=http://localhost:5000/api
```
- Frontend configuration for API endpoint
- Read by Vite at build time

#### `vite.config.js` (UPDATED)
Added proxy configuration:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
    },
  },
}
```

#### `package.json` (UPDATED)
New scripts:
- `npm run server` - Run backend with auto-reload
- `npm run server:start` - Run backend without reload
- `npm run all` - Run frontend + backend together

### Setup Scripts

#### `setup.bat` (Windows)
- Checks for Node.js
- Installs frontend dependencies
- Installs backend dependencies
- Shows next steps

#### `setup.sh` (Mac/Linux)
- Same functionality as setup.bat
- Uses bash commands

### Documentation Files

#### `QUICK_START.md`
- 2-minute getting started guide
- Default credentials
- Basic API examples
- Troubleshooting tips

#### `DATABASE_SETUP.md`
- Complete technical documentation
- Database schema details
- All 14 API endpoints documented
- Deployment notes

#### `ARCHITECTURE.md`
- System architecture diagrams
- Data flow visualizations
- Technology stack overview
- Table relationships

#### `SUMMARY.md`
- Implementation overview
- Before/after comparison
- Integration checklist
- Next steps

---

## 🔄 Data Flow Through Files

### Example: User Login

```
1. User types credentials in browser
         ↓
2. App.jsx calls authAPI.login()
         ↓
3. src/services/api.js → fetch to /api/auth/login
         ↓
4. vite.config.js proxy → http://localhost:5000/api/auth/login
         ↓
5. server/routes/auth.js → receives POST request
         ↓
6. server/db/database.js → queries SQLite
         ↓
7. server/db/studentportal.db → returns user record
         ↓
8. auth.js → sends JSON response back
         ↓
9. api.js → returns parsed data
         ↓
10. App.jsx → updates state with user info
```

### Example: Get All Students

```
Users clicks "View Students"
         ↓
App.jsx calls studentsAPI.getAll()
         ↓
api.js → fetch to /api/students
         ↓
server/routes/students.js receives GET
         ↓
database.js → SELECT * FROM students
         ↓
studentportal.db → returns array of 10 students
         ↓
students.js → sends JSON array back
         ↓
api.js → returns array
         ↓
App.jsx → maps students to components and displays
```

---

## 💾 Database File Location

```
server/db/studentportal.db

Size: ~32 KB (SQLite file with all 5 tables + data)
Created: Automatically on first server run
Format: Binary SQLite3 format
Backed up: Copy server/db/ folder to backup database
Reset: Delete studentportal.db and restart server
```

---

## 🔌 Port Usage

```
Frontend:  http://localhost:5173  (Vite dev server)
Backend:   http://localhost:5000  (Express server)
Database:  Local file (no port needed)

To change ports:
- Frontend: Vite will suggest next available port
- Backend: Edit PORT in server/server.js or set PORT env var
```

---

## 📦 Dependencies Summary

### Frontend (`package.json`)
```json
"dependencies": {
  "react": "^19.2.4",
  "react-dom": "^19.2.4",
  "tailwindcss": "^4.2.2",
  "lucide-react": "^1.11.0"
}

"devDependencies": {
  "vite": "^8.0.4",
  "@vitejs/plugin-react": "^6.0.1",
  "concurrently": "^8.2.1"  ← NEW: Run both servers
}
```

### Backend (`server/package.json`)
```json
"dependencies": {
  "express": "^4.18.2",      ← Web framework
  "sqlite3": "^5.1.6",       ← Database
  "cors": "^2.8.5",          ← Cross-origin
  "dotenv": "^16.3.1"        ← Environment vars
}
```

---

## 🎯 File Modification Guide

### To Add New Features:

**Add API endpoint:**
1. Edit `server/routes/*.js`
2. Add route handler
3. Query database using `database.js` helpers
4. Return JSON response

**Add frontend UI:**
1. Edit `src/App.jsx` or create new component
2. Import from `src/services/api.js`
3. Call API function
4. Handle response and update state
5. Render JSX

**Update database schema:**
1. Edit `server/db/database.js`
2. Modify CREATE TABLE statement
3. Delete `studentportal.db` to force recreation
4. Restart server

---

## ✅ Verification Checklist

After running `setup.bat` and `npm run all`:

- [ ] Backend running: `npm run server` no errors
- [ ] Frontend running: `npm run dev` no errors
- [ ] File exists: `server/db/studentportal.db` (20-40 KB)
- [ ] API responding: http://localhost:5000/api/health
- [ ] Frontend loading: http://localhost:5173 (no console errors)
- [ ] Can login with admin/123
- [ ] Can view students
- [ ] Can update data

---

## 📈 Project Size

```
Total Size (with node_modules):
├── Frontend node_modules: ~800 MB
└── Backend node_modules: ~200 MB
   Total: ~1 GB

Production Build Size:
├── Frontend dist: ~200 KB (gzipped)
├── Backend: ~5 MB
└── Database: 30-100 KB per 10K records

.gitignore should include:
- node_modules/
- server/db/studentportal.db
- dist/
- .env (if using secrets)
```

---

This structure provides a complete, scalable foundation for your Student Portal! 🚀
