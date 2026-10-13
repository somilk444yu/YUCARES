#!/bin/bash

echo "=========================================="
echo "🚀 YU OXYGEN - QUICK START"
echo "=========================================="
echo ""

# Check if backend is already set up
if [ ! -d "backend/venv" ]; then
    echo "📦 Backend not set up. Running setup..."
    cd backend
    chmod +x setup.sh
    ./setup.sh
    cd ..
    echo ""
fi

# Start backend in background
echo "🔧 Starting Python backend..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 3

# Open the landing page
echo "🌐 Opening landing page..."
open index.html

echo ""
echo "=========================================="
echo "✅ YU OXYGEN IS RUNNING!"
echo "=========================================="
echo ""
echo "📍 Landing Page: Opened in your browser"
echo "🔌 Backend API: http://localhost:5000"
echo "📊 Database: backend/yu_prebookings.db"
echo ""
echo "To stop the backend:"
echo "  kill $BACKEND_PID"
echo ""
echo "Or press Ctrl+C in the backend terminal"
echo "=========================================="
