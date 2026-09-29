import { Home, PieChart, Wallet, Settings, Plus, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

function Navigation({ activeView, onViewChange, onAddTransaction }) {
  const { theme, toggleTheme } = useTheme();
  
  const navItems = [
    { id: 'dashboard', icon: Home, label: 'Home' },
    { id: 'analytics', icon: PieChart, label: 'Analytics' },
    { id: 'add', icon: Plus, label: 'Add', isCenter: true },
    { id: 'budget', icon: Wallet, label: 'Budget' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const primaryColor = theme === 'light' ? 'text-green-600' : 'text-primary-600';
  const bgColor = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const addBtnBg = theme === 'light' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-600 hover:bg-primary-700';

  return (
    <div className={`fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md ${bgColor} border-t ${borderColor} px-6 py-3 z-50`}>
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={onAddTransaction}
                className={`flex flex-col items-center justify-center w-14 h-14 -mt-8 ${addBtnBg} rounded-full shadow-lg transition-colors`}
              >
                <Icon className="w-6 h-6 text-white" />
              </button>
            );
          }
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${
                isActive ? primaryColor : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
        
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`flex flex-col items-center justify-center w-12 h-12 transition-colors ${
            theme === 'light' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {theme === 'light' ? (
            <Moon className="w-6 h-6" />
          ) : (
            <Sun className="w-6 h-6" />
          )}
          <span className="text-xs mt-1">{theme === 'light' ? 'Dark' : 'Light'}</span>
        </button>
      </div>
    </div>
  );
}

export default Navigation;
