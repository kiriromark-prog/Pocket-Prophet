import { ArrowUp, ArrowDown, TrendingUp, Utensils, Car, ShoppingBag, Zap, Home as HomeIcon, MoreHorizontal } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { formatCurrency } from '../utils/currency';

function Dashboard({ data, onRefresh }) {
  const { theme } = useTheme();
  
  if (!data) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const categoryIcons = {
    'Food': Utensils,
    'Transport': Car,
    'Shopping': ShoppingBag,
    'Bills': Zap,
    'Housing': HomeIcon,
  };

  const getCategoryIcon = (category) => {
    const Icon = categoryIcons[category] || MoreHorizontal;
    return <Icon className="w-5 h-5" />;
  };

  const recentTransactions = data.recent_transactions || [];
  const currencySymbol = data.currency_symbol || '$';

  // Theme-based styling
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subTextColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const cardBg = theme === 'light' ? 'bg-white' : 'bg-gray-700';
  const borderColor = theme === 'light' ? 'border-gray-100' : 'border-gray-600';
  const balanceGradient = theme === 'light' 
    ? 'bg-gradient-to-br from-green-500 to-green-700' 
    : 'bg-gradient-to-br from-primary-600 to-primary-800';
  const balanceText = theme === 'light' ? 'text-green-100' : 'text-primary-200';

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${textColor}`}>Dashboard</h1>
          <p className={`${subTextColor} text-sm`}>Welcome back!</p>
        </div>
        <button 
          onClick={onRefresh}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <MoreHorizontal className={`w-6 h-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
        </button>
      </div>

      {/* Balance Card */}
      <div className={`${balanceGradient} rounded-3xl p-6 text-white mb-6 shadow-lg`}>
        <p className={`${balanceText} text-sm mb-1`}>Total Balance</p>
        <h2 className="text-4xl font-bold mb-4">
          {formatCurrency(data.total_balance, data.currency, currencySymbol)}
        </h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <ArrowUp className="w-4 h-4" />
            </div>
            <div>
              <p className={`text-xs ${balanceText}`}>Income</p>
              <p className="font-semibold">{formatCurrency(data.total_income, data.currency, currencySymbol)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <ArrowDown className="w-4 h-4" />
            </div>
            <div>
              <p className={`text-xs ${balanceText}`}>Expenses</p>
              <p className="font-semibold">{formatCurrency(data.total_expenses, data.currency, currencySymbol)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Savings */}
      <div className={`${cardBg} rounded-2xl p-5 shadow-sm border ${borderColor} mb-6`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className={`${subTextColor} text-sm`}>Total Savings</p>
              <p className={`text-xl font-bold ${textColor}`}>
                {formatCurrency(data.total_savings, data.currency, currencySymbol)}
              </p>
            </div>
          </div>
          <span className="text-green-600 text-sm font-medium">+12.5%</span>
        </div>
      </div>

      {/* Top Spending */}
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Top Spending</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { category: 'Food', amount: 450, color: 'bg-orange-100 text-orange-600' },
            { category: 'Transport', amount: 200, color: 'bg-blue-100 text-blue-600' },
            { category: 'Shopping', amount: 350, color: 'bg-pink-100 text-pink-600' },
            { category: 'Bills', amount: 280, color: 'bg-yellow-100 text-yellow-600' },
          ].map((item) => (
            <div key={item.category} className="flex flex-col items-center">
              <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-2`}>
                {getCategoryIcon(item.category)}
              </div>
              <p className={`text-xs ${subTextColor}`}>{item.category}</p>
              <p className={`text-sm font-semibold ${textColor}`}>{formatCurrency(item.amount, data.currency, currencySymbol)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Budget Progress */}
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Monthly Budget</h3>
        <div className="space-y-4">
          {[
            { category: 'Food', spent: 450, limit: 500, color: 'bg-orange-500' },
            { category: 'Transport', spent: 200, limit: 300, color: 'bg-blue-500' },
            { category: 'Shopping', spent: 350, limit: 400, color: 'bg-pink-500' },
          ].map((item) => (
            <div key={item.category}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{item.category}</span>
                <span className={`text-sm ${subTextColor}`}>{formatCurrency(item.spent, data.currency, currencySymbol)} / {formatCurrency(item.limit, data.currency, currencySymbol)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full transition-all`}
                  style={{ width: `${(item.spent / item.limit) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Recent Transactions</h3>
        <div className="space-y-3">
          {recentTransactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.id}
              className={`flex items-center justify-between p-4 ${cardBg} rounded-xl shadow-sm border ${borderColor}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {transaction.type === 'income' ? (
                    <ArrowUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <ArrowDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div>
                  <p className={`font-medium ${textColor}`}>{transaction.description || transaction.category}</p>
                  <p className={`text-xs ${subTextColor}`}>{transaction.category}</p>
                </div>
              </div>
              <span className={`font-semibold ${
                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, data.currency, currencySymbol)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
