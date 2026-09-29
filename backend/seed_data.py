"""
Seed data script for Pocket Prophet
Run this to populate the database with sample data
"""
from app import app, db, User, Transaction, Budget
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash

def seed_data():
    with app.app_context():
        # Create tables
        db.create_all()
        
        # Check if user already exists
        existing_user = User.query.filter_by(username='demo_user').first()
        if existing_user:
            print("Demo user already exists. Skipping seed data.")
            return
        
        # Create a demo user with country and currency
        user = User(
            username='demo_user',
            email='demo@example.com',
            password_hash=generate_password_hash('demo123'),
            country='US',
            currency='USD',
            monthly_income=5000
        )
        db.session.add(user)
        db.session.commit()
        
        # Add sample transactions for the last 3 months
        transactions = []
        categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Housing', 'Entertainment', 'Health']
        
        # Income transactions
        for month in range(3):
            date = datetime.now() - timedelta(days=30*month)
            transactions.append(Transaction(
                user_id=user.id,
                type='income',
                amount=5000,
                category='Salary',
                description='Monthly salary',
                date=date
            ))
        
        # Expense transactions
        for month in range(3):
            base_date = datetime.now() - timedelta(days=30*month)
            for day in range(1, 28, 3):  # Every 3 days
                date = base_date.replace(day=day)
                category = categories[(day // 3) % len(categories)]
                amount = round(50 + (day * 5), 2)
                transactions.append(Transaction(
                    user_id=user.id,
                    type='expense',
                    amount=amount,
                    category=category,
                    description=f'{category} expense',
                    date=date
                ))
        
        db.session.add_all(transactions)
        
        # Add sample budgets
        budgets = [
            Budget(user_id=user.id, category='Food', monthly_limit=500),
            Budget(user_id=user.id, category='Transport', monthly_limit=300),
            Budget(user_id=user.id, category='Shopping', monthly_limit=400),
            Budget(user_id=user.id, category='Bills', monthly_limit=350),
            Budget(user_id=user.id, category='Entertainment', monthly_limit=200),
        ]
        db.session.add_all(budgets)
        
        db.session.commit()
        
        print("✅ Sample data seeded successfully!")
        print(f"✅ Created user: {user.username}")
        print(f"✅ Country: {user.country}, Currency: {user.currency}")
        print(f"✅ Added {len(transactions)} transactions")
        print(f"✅ Added {len(budgets)} budget categories")

if __name__ == '__main__':
    seed_data()
