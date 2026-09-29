import { useState } from 'react';
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getCurrencySymbol } from '../utils/currency';

function AddTransactionModal({ onClose, onTransactionAdded }) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Housing', 'Entertainment', 'Health', 'Other'];
  const currencySymbol = getCurrencySymbol(user?.currency || 'USD');

  // Theme-based styling
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subTextColor = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const labelColor = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const inputBg = theme === 'light' ? 'bg-white' : 'bg-gray-600';
  const inputBorder = theme === 'light' ? 'border-gray-300' : 'border-gray-500';
  const primaryBtnBg = theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700';
  const primaryFocus = theme === 'light' ? 'focus:ring-green-500' : 'focus:ring-primary-500';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          type,
          amount: parseFloat(amount),
          category,
          description,
          date: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        onTransactionAdded();
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className={`${inputBg} w-full max-w-md rounded-t-3xl p-6 animate-slide-up`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-xl font-bold ${textColor}`}>Add Transaction</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full transition-colors"
          >
            <X className={`w-6 h-6 ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`} />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setType('income')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
              type === 'income'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowUp className="w-5 h-5" />
              <span>Income</span>
            </div>
          </button>
          <button
            onClick={() => setType('expense')}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
              type === 'expense'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <ArrowDown className="w-5 h-5" />
              <span>Expense</span>
            </div>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="mb-4">
            <label className={`block text-sm font-medium ${labelColor} mb-2`}>
              Amount
            </label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${subTextColor} font-semibold`}>
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-12 pr-4 py-3 border ${inputBorder} rounded-xl ${primaryFocus} focus:border-transparent outline-none ${inputBg}`}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="mb-4">
            <label className={`block text-sm font-medium ${labelColor} mb-2`}>
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-4 py-3 border ${inputBorder} rounded-xl ${primaryFocus} focus:border-transparent outline-none ${inputBg}`}
              required
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className={`block text-sm font-medium ${labelColor} mb-2`}>
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-4 py-3 border ${inputBorder} rounded-xl ${primaryFocus} focus:border-transparent outline-none ${inputBg}`}
              placeholder="Add a note..."
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-4 ${primaryBtnBg} text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTransactionModal;
