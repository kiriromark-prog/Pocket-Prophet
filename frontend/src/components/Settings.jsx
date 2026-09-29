import { User, Bell, Shield, CreditCard, LogOut, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

function SettingsView({ onLogout }) {
  const { user } = useAuth();
  const { theme } = useTheme();

  // Theme-based styling
  const textColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const subTextColor = theme === 'light' ? 'text-gray-500' : 'text-gray-400';
  const cardBg = theme === 'light' ? 'bg-white' : 'bg-gray-700';
  const borderColor = theme === 'light' ? 'border-gray-100' : 'border-gray-600';
  const primaryBg = theme === 'light' ? 'bg-green-100' : 'bg-primary-100';
  const primaryText = theme === 'light' ? 'text-green-600' : 'text-primary-600';
  const primaryBtnBg = theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700';
  const hoverBg = theme === 'light' ? 'hover:bg-gray-50' : 'hover:bg-gray-600';

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${textColor}`}>Settings</h1>
        <p className={`${subTextColor} text-sm`}>Manage your preferences</p>
      </div>

      {/* Profile Section */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor} mb-6`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-16 h-16 ${primaryBg} rounded-full flex items-center justify-center`}>
            <User className={`w-8 h-8 ${primaryText}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${textColor}`}>{user?.username || 'User'}</h3>
            <p className={`text-sm ${subTextColor}`}>{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <button className={`w-full py-2 px-4 ${primaryBtnBg} text-white rounded-xl font-medium transition-colors`}>
          Edit Profile
        </button>
      </div>

      {/* Currency Info */}
      <div className={`${cardBg} rounded-2xl p-6 shadow-sm border ${borderColor} mb-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className={`font-semibold ${textColor}`}>Currency</h3>
            <p className={`text-sm ${subTextColor}`}>{user?.currency || 'USD'} - {user?.country || 'US'}</p>
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className={`${cardBg} rounded-2xl shadow-sm border ${borderColor} divide-y ${theme === 'light' ? 'divide-gray-100' : 'divide-gray-600'}`}>
        <button className={`w-full flex items-center justify-between p-4 ${hoverBg} transition-colors`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Notifications</span>
          </div>
          <div className={`w-12 h-6 ${theme === 'light' ? 'bg-green-600' : 'bg-primary-600'} rounded-full relative`}>
            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
          </div>
        </button>

        <button className={`w-full flex items-center justify-between p-4 ${hoverBg} transition-colors`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Security</span>
          </div>
          <div className="text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>

        <button className={`w-full flex items-center justify-between p-4 ${hoverBg} transition-colors`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-orange-600" />
            </div>
            <span className={`font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>Payment Methods</span>
          </div>
          <div className="text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Logout Button */}
      <button 
        onClick={onLogout}
        className="w-full mt-6 flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span>Log Out</span>
      </button>
    </div>
  );
}

export default SettingsView;
