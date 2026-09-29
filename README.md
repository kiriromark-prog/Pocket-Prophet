# Pocket Prophet - Personal Finance Tracker

A full-stack personal finance management application with a mobile-first deep purple UI theme. Track your income, expenses, budgets, and get AI-powered financial insights.

## Tech Stack

### Backend
- **Flask** - Python web framework
- **Flask-SQLAlchemy** - ORM for database management
- **Flask-CORS** - Cross-origin resource sharing
- **PostgreSQL** - Relational database
- **psycopg2** - PostgreSQL adapter

### Frontend
- **React** - UI library (via Vite)
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Recharts** - Charting library for donut and line graphs

## Features

- 📊 **Dashboard** - View total balance, income, expenses, and recent transactions
- 📈 **Analytics** - Interactive donut chart showing spending by category
- 💰 **Budget Tracking** - Set and monitor category budgets with progress indicators
- 🤖 **AI Insights** - Automated financial recommendations based on spending patterns
- 📱 **Mobile-First UI** - Clean, modern interface with bottom navigation
- 🎨 **Deep Purple Theme** - Beautiful gradient cards and rounded UI elements

## Project Structure

```
pocket-prophet/
├── backend/
│   ├── app.py              # Flask application with API endpoints
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
└── frontend/
    ├── src/
    │   ├── components/     # React components
    │   ├── App.jsx         # Main application component
    │   └── index.css       # Tailwind CSS imports
    ├── tailwind.config.js  # Tailwind configuration
    └── package.json        # Node dependencies
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- PostgreSQL 12+

### 1. Database Setup

**Option 1: SQLite (Easiest - No setup required)**
The app now defaults to SQLite for easy setup. No database installation needed!

**Option 2: PostgreSQL (For production use)**

#### Install PostgreSQL

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Windows:**
Download and install from [PostgreSQL Official Site](https://www.postgresql.org/download/windows/)

#### Create Database

```bash
# Start PostgreSQL service
sudo service postgresql start

# Login to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE finance_db;
CREATE USER your_username WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE finance_db TO your_username;
\q
```

Then edit `backend/.env` and uncomment the DATABASE_URL line with your credentials.

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# SQLite is used by default - no configuration needed!
# For PostgreSQL, uncomment and edit DATABASE_URL in .env

# Initialize database (creates tables)
python app.py
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## API Endpoints

### Dashboard
- `GET /api/dashboard?user_id=1` - Returns balance, income, expenses, and recent transactions

### Reports
- `GET /api/reports/spending?user_id=1` - Aggregates expenses by category

### Budget
- `GET /api/budget?user_id=1` - Fetches budget limits vs current spending
- `POST /api/budget` - Add a new budget category

### Transactions
- `GET /api/transactions?user_id=1` - Get all transactions
- `POST /api/transactions` - Add a new transaction

### AI Insights
- `GET /api/ai-insights?user_id=1` - Get personalized financial recommendations

### Historical Data
- `GET /api/historical?user_id=1&months=6` - Get historical financial trends

## Database Schema

### User Model
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password_hash` - Hashed password
- `monthly_income` - Monthly income amount

### Transaction Model
- `id` - Primary key
- `user_id` - Foreign key to User
- `type` - 'income' or 'expense'
- `amount` - Transaction amount
- `category` - Category (Food, Transport, Shopping, etc.)
- `description` - Transaction description
- `date` - Transaction date

### Budget Model
- `id` - Primary key
- `user_id` - Foreign key to User
- `category` - Budget category
- `monthly_limit` - Monthly spending limit

## Usage

1. Open your browser to `http://localhost:5173`
2. Use the bottom navigation to switch between views:
   - **Home** - Dashboard with balance and transactions
   - **Analytics** - Spending breakdown with donut chart
   - **+** - Add new income or expense
   - **Budget** - Budget health and AI insights
   - **Settings** - App preferences

## Adding Sample Data

To test the application with sample data, you can use the Python REPL:

```python
from backend.app import app, db, User, Transaction, Budget

with app.app_context():
    # Create a test user
    user = User(username='testuser', email='test@example.com', password_hash='hashed_password', monthly_income=5000)
    db.session.add(user)
    db.session.commit()
    
    # Add sample transactions
    transactions = [
        Transaction(user_id=1, type='income', amount=5000, category='Salary', description='Monthly salary'),
        Transaction(user_id=1, type='expense', amount=450, category='Food', description='Groceries'),
        Transaction(user_id=1, type='expense', amount=200, category='Transport', description='Gas'),
        Transaction(user_id=1, type='expense', amount=350, category='Shopping', description='Clothes'),
        Transaction(user_id=1, type='expense', amount=280, category='Bills', description='Electricity'),
    ]
    db.session.add_all(transactions)
    
    # Add sample budgets
    budgets = [
        Budget(user_id=1, category='Food', monthly_limit=500),
        Budget(user_id=1, category='Transport', monthly_limit=300),
        Budget(user_id=1, category='Shopping', monthly_limit=400),
    ]
    db.session.add_all(budgets)
    
    db.session.commit()
```

## Development

### Backend Development
```bash
cd backend
source venv/bin/activate
python app.py
```

### Frontend Development
```bash
cd frontend
npm run dev
```

## Troubleshooting

### PostgreSQL Connection Issues
- Ensure PostgreSQL service is running
- Verify database credentials in `.env` file
- Check if database exists: `sudo -u postgres psql -l`

### CORS Errors
- Ensure Flask-CORS is properly configured in `app.py`
- Check that frontend is making requests to correct backend URL

### Port Already in Use
- Change backend port in `app.py` (default: 5000)
- Change frontend port in Vite config (default: 5173)

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
