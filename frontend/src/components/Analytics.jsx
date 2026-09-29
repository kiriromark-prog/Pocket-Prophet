import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { formatCurrency } from '../utils/currency';

function Analytics() {
  const { theme } = useTheme();
  const [spendingData, setSpendingData] = useState([]);
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [loading, setLoading] = useState(true);

  const COLORS = theme === 'light' 
    ? ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d']
    : ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe'];

  useEffect(() => {
    const fetchSpendingData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/reports/spending', {
          credentials: 'include',
        });
        const data = await response.json();
        setSpendingData(data.spending || []);
        setCurrency(data.currency || 'USD');
        setCurrencySymbol(data.currency_symbol || '$');
        setLoading(false);
      } catch (error) {
        console.error('Error fetching spending data:', error);
        setLoading(false);
      }
    };

    fetchSpendingData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  const totalSpending = spendingData.reduce((sum, item) => sum + item.amount, 0);

  // Theme-based styling
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subTextColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const cardBg = theme === 'light' ? 'bg-white' : 'bg-gray-700';
  const borderColor = theme === 'light' ? 'border-gray-100' : 'border-gray-600';

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${textColor}`}>Analytics</h1>
        <p className={`${subTextColor} text-sm`}>Your spending breakdown</p>
      </div>

      {/* Donut Chart */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor} mb-6`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Spending by Category</h3>
        <div className="h-64">
          {spendingData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {spendingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value, currency, currencySymbol)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              No spending data available
            </div>
          )}
        </div>
      </div>

      {/* Spending Breakdown List */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor}`}>
        <h3 className={`text-lg font-semibold ${textColor} mb-4`}>Detailed Breakdown</h3>
        <div className="space-y-3">
          {spendingData.length > 0 ? (
            spendingData.map((item, index) => {
              const percentage = totalSpending > 0 ? (item.amount / totalSpending * 100).toFixed(1) : 0;
              return (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${textColor}`}>{formatCurrency(item.amount, currency, currencySymbol)}</p>
                    <p className={`text-xs ${subTextColor}`}>{percentage}%</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-8">
              No spending data available. Add some transactions to see your analytics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;
