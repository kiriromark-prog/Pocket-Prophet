# Quick Start Guide

## Option 1: Start Both Servers (Recommended)

```bash
./start.sh
```

This will start both the Flask backend (port 5000) and React frontend (port 5173) simultaneously.

## Option 2: Start Separately

### Backend
```bash
cd backend
source venv/bin/activate
python app.py
```

### Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```

## Access the App

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## Database

The app uses SQLite by default (no setup required). The database file will be created as `backend/finance.db`.

Sample data has already been seeded with:
- 1 demo user
- 30 transactions across 3 months
- 5 budget categories

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

**Backend won't start?**
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

**Frontend won't start?**
```bash
cd frontend
npm install
```
