#!/bin/bash

echo "🚀 Pocket Prophet Quick Start"
echo "=============================="
echo ""

echo "📋 Using SQLite for easy setup (no PostgreSQL required)"

# Setup Backend
echo ""
echo "📦 Setting up Backend..."
cd backend

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate venv
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "✅ Using SQLite database (no configuration needed)"
fi

# Seed data
echo ""
echo "🌱 Seeding sample data..."
python seed_data.py

# Start Backend
echo ""
echo "🔧 Starting Backend server on http://localhost:5000"
python app.py &
BACKEND_PID=$!

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."
cd ../frontend

# Install dependencies
echo "Installing Node dependencies..."
npm install

# Start Frontend
echo ""
echo "🎨 Starting Frontend server on http://localhost:5173"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Pocket Prophet is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
