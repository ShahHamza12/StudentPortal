@echo off
REM Student Portal - Database Quick Setup for Windows

echo.
echo 🚀 Student Portal - Database Setup Script
echo ==========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo ✓ Node.js version: %NODE_VERSION%
echo.

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)
echo ✓ Frontend dependencies installed
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install backend dependencies
    cd ..
    exit /b 1
)
echo ✓ Backend dependencies installed
cd ..
echo.

echo ✅ Setup complete!
echo.
echo 🚀 To run the application:
echo    npm run all              (Run both frontend + backend)
echo.
echo    Or run separately:
echo    Terminal 1: npm run server
echo    Terminal 2: npm run dev
echo.
echo 📍 Access at: http://localhost:5173
echo 💾 Database: server\db\studentportal.db
echo.
pause
