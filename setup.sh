#!/bin/bash
# Student Portal - Database Quick Setup

echo "🚀 Student Portal - Database Setup Script"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi
echo "✓ Frontend dependencies installed"
echo ""

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    cd ..
    exit 1
fi
echo "✓ Backend dependencies installed"
cd ..
echo ""

echo "✅ Setup complete!"
echo ""
echo "🚀 To run the application:"
echo "   npm run all              (Run both frontend + backend)"
echo ""
echo "   Or run separately:"
echo "   Terminal 1: npm run server"
echo "   Terminal 2: npm run dev"
echo ""
echo "📍 Access at: http://localhost:5173"
echo "💾 Database: server/db/studentportal.db"
echo ""
