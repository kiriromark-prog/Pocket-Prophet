from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime, timedelta
from sqlalchemy import func
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash
import secrets

load_dotenv()

app = Flask(__name__)
CORS(app, supports_credentials=True)
app.secret_key = os.getenv('SECRET_KEY', secrets.token_hex(32))

# Database configuration
# Use SQLite for easy setup, or PostgreSQL if DATABASE_URL is provided
database_url = os.getenv('DATABASE_URL')
if database_url and database_url.startswith('postgresql'):
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///finance.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Currency mapping by country
COUNTRY_CURRENCY_MAP = {
    'US': 'USD',
    'GB': 'GBP',
    'EU': 'EUR',
    'KE': 'KES',
    'CA': 'CAD',
    'AU': 'AUD',
    'JP': 'JPY',
    'IN': 'INR',
    'NG': 'NGN',
    'ZA': 'ZAR',
    'BR': 'BRL',
    'MX': 'MXN',
    'CN': 'CNY',
    'CH': 'CHF',
    'RU': 'RUB',
    'KR': 'KRW',
    'SG': 'SGD',
    'HK': 'HKD',
    'NO': 'NOK',
    'SE': 'SEK',
    'DK': 'DKK',
}

CURRENCY_SYMBOLS = {
    'USD': '$',
    'GBP': '£',
    'EUR': '€',
    'KES': 'KSh',
    'CAD': 'C$',
    'AUD': 'A$',
    'JPY': '¥',
    'INR': '₹',
    'NGN': '₦',
    'ZAR': 'R',
    'BRL': 'R$',
    'MXN': 'MX$',
    'CNY': '¥',
    'CHF': 'Fr',
    'RUB': '₽',
    'KRW': '₩',
    'SGD': 'S$',
    'HKD': 'HK$',
    'NOK': 'kr',
    'SEK': 'kr',
    'DKK': 'kr',
}

def get_currency_from_country(country_code):
    return COUNTRY_CURRENCY_MAP.get(country_code.upper(), 'USD')

def get_currency_symbol(currency_code):
    return CURRENCY_SYMBOLS.get(currency_code, '$')

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    country = db.Column(db.String(10), nullable=False)
    currency = db.Column(db.String(10), nullable=False)
    monthly_income = db.Column(db.Float, default=0)
    transactions = db.relationship('Transaction', backref='user', lazy=True)
    budgets = db.relationship('Budget', backref='user', lazy=True)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(10), nullable=False)  # 'income' or 'expense'
    amount = db.Column(db.Float, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(255))
    date = db.Column(db.DateTime, default=datetime.utcnow)

class Budget(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    monthly_limit = db.Column(db.Float, nullable=False)

# Authentication decorator
def login_required(f):
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    decorated_function.__name__ = f.__name__
    return decorated_function

# API Endpoints

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already taken'}), 400
    
    # Determine currency from country
    currency = get_currency_from_country(data.get('country', 'US'))
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        country=data.get('country', 'US'),
        currency=currency
    )
    
    db.session.add(user)
    db.session.commit()
    
    # Log in the user
    session['user_id'] = user.id
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'country': user.country,
        'currency': user.currency,
        'message': 'Registration successful'
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    session['user_id'] = user.id
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'country': user.country,
        'currency': user.currency,
        'message': 'Login successful'
    })

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logout successful'})

@app.route('/api/auth/me', methods=['GET'])
def get_current_user():
    if 'user_id' not in session:
        return jsonify({'error': 'Not authenticated'}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'country': user.country,
        'currency': user.currency,
        'currency_symbol': get_currency_symbol(user.currency)
    })

@app.route('/api/dashboard', methods=['GET'])
@login_required
def get_dashboard():
    user_id = session['user_id']
    
    # Calculate totals
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    
    total_income = sum(t.amount for t in transactions if t.type == 'income')
    total_expenses = sum(t.amount for t in transactions if t.type == 'expense')
    total_balance = total_income - total_expenses
    
    # Get recent transactions (last 10)
    recent_transactions = sorted(
        transactions,
        key=lambda x: x.date,
        reverse=True
    )[:10]
    
    # Calculate total savings
    total_savings = total_balance
    
    # Get user currency info
    user = User.query.get(user_id)
    currency_symbol = get_currency_symbol(user.currency) if user else '$'
    
    return jsonify({
        'total_balance': total_balance,
        'total_income': total_income,
        'total_expenses': total_expenses,
        'total_savings': total_savings,
        'currency': user.currency if user else 'USD',
        'currency_symbol': currency_symbol,
        'recent_transactions': [
            {
                'id': t.id,
                'type': t.type,
                'amount': t.amount,
                'category': t.category,
                'description': t.description,
                'date': t.date.isoformat()
            }
            for t in recent_transactions
        ]
    })

@app.route('/api/reports/spending', methods=['GET'])
@login_required
def get_spending_report():
    user_id = session['user_id']
    
    # Aggregate expenses by category
    expenses = db.session.query(
        Transaction.category,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense'
    ).group_by(Transaction.category).all()
    
    spending_data = [
        {'category': category, 'amount': float(total)}
        for category, total in expenses
    ]
    
    # Get user currency info
    user = User.query.get(user_id)
    currency_symbol = get_currency_symbol(user.currency) if user else '$'
    
    return jsonify({
        'spending': spending_data,
        'currency': user.currency if user else 'USD',
        'currency_symbol': currency_symbol
    })

@app.route('/api/budget', methods=['GET'])
@login_required
def get_budget():
    user_id = session['user_id']
    
    budgets = Budget.query.filter_by(user_id=user_id).all()
    
    # Get user currency info
    user = User.query.get(user_id)
    currency_symbol = get_currency_symbol(user.currency) if user else '$'
    
    budget_data = []
    for budget in budgets:
        # Calculate current spending for this category
        current_month = datetime.now().replace(day=1)
        current_spending = db.session.query(
            func.sum(Transaction.amount)
        ).filter(
            Transaction.user_id == user_id,
            Transaction.category == budget.category,
            Transaction.type == 'expense',
            Transaction.date >= current_month
        ).scalar() or 0
        
        budget_data.append({
            'category': budget.category,
            'monthly_limit': budget.monthly_limit,
            'current_spending': float(current_spending),
            'remaining': budget.monthly_limit - current_spending,
            'percentage': (current_spending / budget.monthly_limit * 100) if budget.monthly_limit > 0 else 0
        })
    
    return jsonify({
        'budgets': budget_data,
        'currency': user.currency if user else 'USD',
        'currency_symbol': currency_symbol
    })

@app.route('/api/transactions', methods=['POST'])
@login_required
def add_transaction():
    data = request.json
    
    transaction = Transaction(
        user_id=session['user_id'],
        type=data['type'],
        amount=data['amount'],
        category=data['category'],
        description=data.get('description', ''),
        date=datetime.fromisoformat(data.get('date', datetime.utcnow().isoformat()))
    )
    
    db.session.add(transaction)
    db.session.commit()
    
    return jsonify({
        'id': transaction.id,
        'message': 'Transaction added successfully'
    }), 201

@app.route('/api/ai-insights', methods=['GET'])
@login_required
def get_ai_insights():
    user_id = session['user_id']
    
    insights = []
    
    # Compare current month to previous month
    current_month = datetime.now().replace(day=1)
    previous_month = (current_month - timedelta(days=32)).replace(day=1)
    
    current_expenses = db.session.query(
        func.sum(Transaction.amount)
    ).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense',
        Transaction.date >= current_month
    ).scalar() or 0
    
    previous_expenses = db.session.query(
        func.sum(Transaction.amount)
    ).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense',
        Transaction.date >= previous_month,
        Transaction.date < current_month
    ).scalar() or 0
    
    if previous_expenses > 0:
        change = ((current_expenses - previous_expenses) / previous_expenses) * 100
        if change > 20:
            insights.append({
                'type': 'warning',
                'message': f'Your spending increased by {change:.1f}% compared to last month. Review your expenses.'
            })
        elif change < -20:
            insights.append({
                'type': 'success',
                'message': f'Great job! Your spending decreased by {abs(change):.1f}% compared to last month.'
            })
    
    # Check top spending category
    top_category = db.session.query(
        Transaction.category,
        func.sum(Transaction.amount).label('total')
    ).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense',
        Transaction.date >= current_month
    ).group_by(Transaction.category).order_by(func.sum(Transaction.amount).desc()).first()
    
    if top_category:
        user = User.query.get(user_id)
        currency_symbol = get_currency_symbol(user.currency) if user else '$'
        insights.append({
            'type': 'info',
            'message': f'Your highest spending category this month is {top_category[0]} at {currency_symbol}{top_category[1]:.2f}.'
        })
    
    # Check budget health
    budgets = Budget.query.filter_by(user_id=user_id).all()
    user = User.query.get(user_id)
    currency_symbol = get_currency_symbol(user.currency) if user else '$'
    
    for budget in budgets:
        current_spending = db.session.query(
            func.sum(Transaction.amount)
        ).filter(
            Transaction.user_id == user_id,
            Transaction.category == budget.category,
            Transaction.type == 'expense',
            Transaction.date >= current_month
        ).scalar() or 0
        
        if budget.monthly_limit > 0:
            percentage = (current_spending / budget.monthly_limit) * 100
            if percentage > 90:
                insights.append({
                    'type': 'danger',
                    'message': f'You have used {percentage:.1f}% of your {budget.category} budget ({currency_symbol}{current_spending:.2f}/{currency_symbol}{budget.monthly_limit:.2f}). Consider reducing spending.'
                })
            elif percentage > 70:
                insights.append({
                    'type': 'warning',
                    'message': f'You have used {percentage:.1f}% of your {budget.category} budget ({currency_symbol}{current_spending:.2f}/{currency_symbol}{budget.monthly_limit:.2f}).'
                })
    
    # Savings rate
    total_income = db.session.query(
        func.sum(Transaction.amount)
    ).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'income',
        Transaction.date >= current_month
    ).scalar() or 0
    
    if total_income > 0:
        savings_rate = ((total_income - current_expenses) / total_income) * 100
        if savings_rate < 10:
            insights.append({
                'type': 'warning',
                'message': f'Your savings rate is {savings_rate:.1f}%. Aim to save at least 20% of your income.'
            })
        else:
            insights.append({
                'type': 'success',
                'message': f'Your savings rate is {savings_rate:.1f}%. Keep up the good work!'
            })
    
    # Add currency info to insights
    return jsonify({
        'insights': insights,
        'currency': user.currency if user else 'USD',
        'currency_symbol': currency_symbol
    })
    
    return jsonify(insights)

@app.route('/api/transactions', methods=['GET'])
@login_required
def get_transactions():
    user_id = session['user_id']
    limit = request.args.get('limit', 50, type=int)
    
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(
        Transaction.date.desc()
    ).limit(limit).all()
    
    return jsonify([
        {
            'id': t.id,
            'type': t.type,
            'amount': t.amount,
            'category': t.category,
            'description': t.description,
            'date': t.date.isoformat()
        }
        for t in transactions
    ])

@app.route('/api/budget', methods=['POST'])
@login_required
def add_budget():
    data = request.json
    
    budget = Budget(
        user_id=session['user_id'],
        category=data['category'],
        monthly_limit=data['monthly_limit']
    )
    
    db.session.add(budget)
    db.session.commit()
    
    return jsonify({
        'id': budget.id,
        'message': 'Budget added successfully'
    }), 201

@app.route('/api/historical', methods=['GET'])
@login_required
def get_historical_data():
    user_id = session['user_id']
    months = request.args.get('months', 6, type=int)
    
    # Get user currency info
    user = User.query.get(user_id)
    currency_symbol = get_currency_symbol(user.currency) if user else '$'
    
    historical_data = []
    for i in range(months):
        month_start = (datetime.now() - timedelta(days=30*i)).replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        income = db.session.query(
            func.sum(Transaction.amount)
        ).filter(
            Transaction.user_id == user_id,
            Transaction.type == 'income',
            Transaction.date >= month_start,
            Transaction.date <= month_end
        ).scalar() or 0
        
        expenses = db.session.query(
            func.sum(Transaction.amount)
        ).filter(
            Transaction.user_id == user_id,
            Transaction.type == 'expense',
            Transaction.date >= month_start,
            Transaction.date <= month_end
        ).scalar() or 0
        
        historical_data.append({
            'month': month_start.strftime('%b %Y'),
            'income': float(income),
            'expenses': float(expenses),
            'savings': float(income - expenses)
        })
    
    return jsonify({
        'data': historical_data[::-1],
        'currency': user.currency if user else 'USD',
        'currency_symbol': currency_symbol
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5000)
