# 📐 Student Portal - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        STUDENT PORTAL                            │
└─────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────┐
                    │   REACT FRONTEND    │
                    │  (Vite - Port 5173) │
                    │                     │
                    │  - App.jsx          │
                    │  - Components       │
                    │  - Login/Dashboard  │
                    └──────────┬──────────┘
                               │
                    HTTP/JSON  │  API Calls
                               │
                    ┌──────────▼──────────┐
                    │   Express Server    │
                    │  (Port 5000)        │
                    │                     │
                    │  ┌────────────────┐ │
                    │  │   Routes       │ │
                    │  │ /api/auth      │ │
                    │  │ /api/students  │ │
                    │  │ /api/teachers  │ │
                    │  └────────────────┘ │
                    └──────────┬──────────┘
                               │
                               │  SQL Queries
                               │
                    ┌──────────▼──────────┐
                    │   SQLite Database   │
                    │                     │
                    │  ┌────────────────┐ │
                    │  │ Table: users   │ │
                    │  │ Table: students│ │
                    │  │ Table: teachers│ │
                    │  │ Table: ...     │ │
                    │  └────────────────┘ │
                    │                     │
                    │  File:              │
                    │  studentportal.db   │
                    └─────────────────────┘
```

---

## Data Flow

### 1️⃣ User Login Flow
```
┌─────────────┐         
│  User logs  │
│  in with    │
│  credentials│
└──────┬──────┘
       │
       │ (Frontend: api.js)
       ▼
┌─────────────────────────────┐
│ POST /api/auth/login        │
│ { userId, password }        │
└──────┬──────────────────────┘
       │
       │ (Backend: auth.js)
       ▼
┌─────────────────────────────┐
│ Query database:             │
│ SELECT * FROM users         │
│ WHERE id = ? AND password = │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│ Return user data            │
│ { id, name, role }          │
└─────────────────────────────┘
```

### 2️⃣ Student Data Retrieval
```
┌──────────────────┐
│ Frontend requests│
│ all students     │
└────────┬─────────┘
         │
         │ GET /api/students
         ▼
┌──────────────────────────────┐
│ Backend queries database:    │
│ SELECT * FROM students       │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ SQLite returns student array │
└────────┬─────────────────────┘
         │
         │ JSON Response
         ▼
┌──────────────────────────────┐
│ Frontend receives & displays │
│ student list                 │
└──────────────────────────────┘
```

### 3️⃣ Update Student Marks
```
┌───────────────────────┐
│ User updates marks    │
│ Math: 95, Science: 90 │
└────────┬──────────────┘
         │
         │ PUT /api/students/:id/marks
         │ { math, science, cs }
         ▼
┌────────────────────────────────┐
│ Backend updates database:      │
│ UPDATE students                │
│ SET math=95, science=90, cs=92 │
│ WHERE id = 'S101'              │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Database confirms update       │
│ Returns updated record         │
└────────┬───────────────────────┘
         │ JSON Response
         ▼
┌────────────────────────────────┐
│ Frontend refreshes display     │
│ Shows new marks                │
└────────────────────────────────┘
```

---

## File Communication Flow

```
FRONTEND LAYER                  API LAYER                 DATA LAYER
────────────────────────────────────────────────────────────────────

App.jsx ──────────────────────────┐
                                  │
                            Uses: api.js
                                  │
                                  ▼
src/services/api.js ─────────► Fetch API
                                  │
                    HTTP POST/GET/PUT/DELETE
                                  │
                                  ▼
server/routes/*.js ◄─────── Express Routes
                                  │
         Uses: database.js helper functions
                                  │
                                  ▼
server/db/database.js ───────► SQLite3
                                  │
                    SQL Queries (INSERT/SELECT/UPDATE/DELETE)
                                  │
                                  ▼
server/db/studentportal.db ─── Physical Database File
```

---

## Table Relationships

```
                 USERS
                 ┌────────────┐
                 │ id (PK)    │
                 │ password   │
                 │ name       │
                 │ role       │
                 └────┬───┬───┘
                      │   │
        ┌─────────────┘   └─────────────┐
        │                               │
        ▼                               ▼
    STUDENTS                        TEACHERS
    ┌──────────────┐              ┌──────────────┐
    │ id (PK/FK)   │              │ id (PK/FK)   │
    │ name         │              │ name         │
    │ math_marks   │              │ department   │
    │ attendance   │              └────┬─────────┘
    │ fees info    │                   │
    └─────┬────────┘                   │
          │                            │
          │                    Has Many│
          │                            │
          ▼                            ▼
    ATTENDANCE_LOG            TEACHER_SCHEDULE
    ┌──────────────┐         ┌──────────────┐
    │ id (PK)      │         │ id (PK)      │
    │ student_id   │         │ teacher_id   │
    │ (FK)         │         │ (FK)         │
    │ month        │         │ day          │
    │ value        │         │ time         │
    └──────────────┘         │ class        │
                             │ room         │
                             └──────────────┘
```

---

## Request-Response Cycle

### Example: Get Student Data

```
CLIENT (React)              NETWORK              SERVER              DATABASE
──────────────              ───────              ──────              ────────

     │
     │ 1. User clicks
     │    "View Details"
     │
     ├─────────────────────────────────────────────────────────────────►
     │  GET /api/students/S101
     │  (HTTP Request)
     │
     │                                              │
     │                                              │ 2. Receive request
     │                                              │ Call handler
     │                                              │
     │                                              ├─────────────────►
     │                                              │ SELECT * FROM
     │                                              │ students WHERE
     │                                              │ id='S101'
     │                                              │
     │                                              │◄─────────────────
     │                                              │ {id, name, marks}
     │                                              │
     │                                              │ 3. Format JSON
     │                                              │
     │◄─────────────────────────────────────────────
     │  HTTP 200
     │  { "id":"S101", "name":"Rahul Kumar", ... }
     │
     │ 4. Parse JSON
     │
     └─► Update state & re-render UI

```

---

## Deployment Architecture (Future)

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLOUD (Azure)                             │
│                                                                   │
│  ┌─────────────────────┐    ┌──────────────┐                   │
│  │  App Service        │    │  SQL Database│                   │
│  │  (React + Vite)     │    │  (Azure SQL) │                   │
│  │  Port: 443 (HTTPS)  │    │  or          │                   │
│  └──────────┬──────────┘    │  PostgreSQL  │                   │
│             │               └──────────────┘                   │
│             │                      ▲                           │
│             │ API Calls            │                           │
│             │                      │                           │
│  ┌──────────▼──────────┐           │                           │
│  │  App Service        │───────────┘                           │
│  │  (Express Server)   │                                       │
│  │  Port: 443 (HTTPS)  │                                       │
│  └─────────────────────┘                                       │
│                                                                   │
│  ┌─────────────────────┐                                       │
│  │  Application        │                                       │
│  │  Insights (Logging) │                                       │
│  └─────────────────────┘                                       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘

                          ▲
                          │ HTTPS
                          │
                    ┌─────┴──────┐
                    │  User      │
                    │  Browser   │
                    └────────────┘
```

---

## Technology Stack

```
┌──────────────────────────────────────────────────────────────┐
│  FRONTEND                                                    │
│  ├─ React 19.2.4         (UI Framework)                     │
│  ├─ Vite 8.0.4          (Build Tool)                        │
│  ├─ Tailwind CSS         (Styling)                          │
│  └─ Lucide React         (Icons)                            │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  BACKEND                                                     │
│  ├─ Node.js 18+          (Runtime)                          │
│  ├─ Express 4.18.2       (Web Framework)                    │
│  ├─ SQLite3 5.1.6        (Database Driver)                  │
│  └─ CORS                 (Cross-Origin Support)             │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│  DATABASE                                                    │
│  └─ SQLite3              (File-based SQL Database)          │
└──────────────────────────────────────────────────────────────┘
```

---

## Development Workflow

```
1. Developer runs:
   npm run all

2. Three processes start:
   ├─ Express Server (localhost:5000)
   ├─ Vite Dev Server (localhost:5173)
   └─ Browser opens to http://localhost:5173

3. Code changes trigger:
   ├─ Hot Module Reload (Frontend)
   └─ Auto-restart (Backend - if using --watch)

4. API calls flow:
   Frontend → Vite Proxy → Backend → Database

5. Data persists in:
   server/db/studentportal.db
```

---

## Security Considerations (For Production)

```
Development              Production
────────────             ──────────
localhost:5173    ──►    HTTPS with SSL/TLS
localhost:5000    ──►    API Gateway / Load Balancer
SQLite            ──►    PostgreSQL / MySQL / Azure SQL
No Auth Token     ──►    JWT / OAuth2
No HTTPS          ──►    HTTPS Everywhere
No Rate Limiting  ──►    Rate Limiting
No Input Validation ──►   Full Input Validation & Sanitization
```

---

This architecture provides a clean separation of concerns and scalable foundation for your Student Portal!
