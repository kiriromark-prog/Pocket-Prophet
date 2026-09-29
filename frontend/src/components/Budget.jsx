import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle, CheckCircle, Info, TrendingUp, TrendingDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { formatCurrency } from '../utils/currency';

function Budget() {
  const { theme } = useTheme();
  const [budgetData, setBudgetData] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [insights, setInsights] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [budgetRes, historicalRes, insightsRes] = await Promise.all([
          fetch('http://localhost:5000/api/budget', { credentials: 'include' }),
          fetch('http://localhost:5000/api/historical?months=6', { credentials: 'include' }),
          fetch('http://localhost:5000/api/ai-insights', { credentials: 'include' }),
        ]);

        const budget = await budgetRes.json();
        const historical = await historicalRes.json();
        const insightsData = await insightsRes.json();

        setBudgetData(budget.budgets || []);
        setHistoricalData(historical.data || []);
        setInsights(insightsData.insights || []);
        setCurrency(budget.currency || 'USD');
        setCurrencySymbol(budget.currency_symbol || '$');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching budget data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getInsightIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'danger':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'danger':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading budget insights...</div>
      </div>
    );
  }

  // Theme-based styling
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subTextColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const cardBg = theme === 'light' ? 'bg-white' : 'bg-gray-700';
  const borderColor = theme === 'light' ? 'border-gray-100' : 'border-gray-600';
  const chartColors = theme === 'light' 
    ? { income: '#22c55e', expenses: '#ef4444', savings: '#16a34a' }
    : { income: '#10b981', expenses: '#ef4444', savings: '#7c3aed' };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${textColor}`}>Budget & Insights</h1>
        <p className={`${subTextColor} text-sm`}>Track your financial health</p>
      </div>

      {/* Historical Trends Line Chart */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor} mb-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Financial Trends</h3>
        <div className="h-64">
          {historicalData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value, currency, currencySymbol)} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke={chartColors.income} strokeWidth={2} name="Income" />
                <Line type="monotone" dataKey="expenses" stroke={chartColors.expenses} strokeWidth={2} name="Expenses" />
                <Line type="monotone" dataKey="savings" stroke={chartColors.savings} strokeWidth={2} name="Savings" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No historical data available
            </div>
          )}
        </div>
      </div>

      {/* Budget Health */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor} mb-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Budget Health</h3>
        <div className="space-y-4">
          {budgetData.length > 0 ? (
            budgetData.map((budget) => (
              <div key={budget.category}>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{budget.category}</span>
                  <span className={`text-sm ${subTextColor}`}>{formatCurrency(budget.current_spending, currency, currencySymbol)} / {formatCurrency(budget.monthly_limit, currency, currencySymbol)}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      budget.percentage > 90 ? 'bg-red-500' : 
                      budget.percentage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                <p className={`text-xs ${subTextColor} mt-1`}>
                  {budget.percentage > 90 ? 'Critical' : budget.percentage > 70 ? 'Warning' : 'On track'}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              No budget data available. Set up budgets to track your spending.
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor}`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>AI Insights</h3>
        <div className="space-y-3">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border ${getInsightColor(insight.type)}`}
              >
                <div className="flex items-start gap-3">
                  {getInsightIcon(insight.type)}
                  <p className="text-sm text-gray-700">{insight.message}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              Add more transactions to get personalized AI insights.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Budget;
