#!/bin/bash

echo "🚀 Starting Pocket Prophet..."
echo ""

# Start Backend
echo "🔧 Starting Backend server..."
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!
echo "✅ Backend running on http://localhost:5000 (PID: $BACKEND_PID)"

# Start Frontend
echo ""
echo "🎨 Starting Frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
echo "✅ Frontend running on http://localhost:5173 (PID: $FRONTEND_PID)"

echo ""
echo "🎉 Pocket Prophet is running!"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"

# Handle cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '🛑 Stopped servers'" EXIT

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
