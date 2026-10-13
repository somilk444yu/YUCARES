#!/bin/bash

echo "=========================================="
echo "🚀 YU OXYGEN - SYSTEM LAUNCH (PROD MODE)"
echo "=========================================="
echo ""

# Setup Backend
echo "🔧 Setting up Server..."
cd backend
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
echo "📥 Installing dependencies..."
pip install -r requirements.txt > /dev/null 2>&1

echo "🟢 Starting Flask Server (Port 5001)..."
# In develop mode we can run app.py directly which now serves static files too
python app.py > server.log 2>&1 &
SERVER_PID=$!
echo "   PID: $SERVER_PID"
cd ..

# Open Browser
echo "🚀 Launching Experience..."
sleep 3
open http://localhost:5001

echo ""
echo "=========================================="
echo "✅ SYSTEM OPERATIONAL"
echo "=========================================="
echo "App URL: http://localhost:5001"
echo ""
echo "Press Ctrl+C to stop..."
echo "=========================================="

trap "kill $SERVER_PID; exit" INT
wait
