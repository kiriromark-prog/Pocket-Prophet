import { useState, useEffect } from 'react';
import { Home, PieChart, Wallet, Settings, Plus } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { useTheme } from './contexts/ThemeContext';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import Budget from './components/Budget';
import SettingsView from './components/Settings';
import AddTransactionModal from './components/AddTransactionModal';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const { user, loading, login, logout } = useAuth();
  const { theme } = useTheme();
  const [activeView, setActiveView] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/dashboard', {
        credentials: 'include',
      });
      const data = await response.json();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [refreshTrigger, user]);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowAddModal(false);
  };

  const handleLogin = (userData) => {
    login(userData);
  };

  const handleRegister = (userData) => {
    login(userData);
  };

  const handleLogout = () => {
    logout();
    setDashboardData(null);
    setActiveView('dashboard');
  };

  // Show loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // Show auth screens if not logged in
  if (!user) {
    if (authView === 'login') {
      return (
        <Login 
          onLogin={handleLogin} 
          onSwitchToRegister={() => setAuthView('register')} 
        />
      );
    } else {
      return (
        <Register 
          onRegister={handleRegister} 
          onSwitchToLogin={() => setAuthView('login')} 
        />
      );
    }
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard data={dashboardData} onRefresh={fetchDashboardData} />;
      case 'analytics':
        return <Analytics />;
      case 'budget':
        return <Budget />;
      case 'settings':
        return <SettingsView onLogout={handleLogout} />;
      default:
        return <Dashboard data={dashboardData} onRefresh={fetchDashboardData} />;
    }
  };

  const bgColor = theme === 'light' ? 'bg-gray-100' : 'bg-gray-900';
  const cardBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';

  return (
    <div className={`min-h-screen ${bgColor} flex justify-center`}>
      <div className={`w-full max-w-md ${cardBg} min-h-screen relative shadow-2xl`}>
        <div className="pb-20">
          {renderView()}
        </div>
        
        <Navigation 
          activeView={activeView} 
          onViewChange={setActiveView}
          onAddTransaction={() => setShowAddModal(true)}
        />
        
        {showAddModal && (
          <AddTransactionModal 
            onClose={() => setShowAddModal(false)}
            onTransactionAdded={handleTransactionAdded}
          />
        )}
      </div>
    </div>
  );
}

export default App;
