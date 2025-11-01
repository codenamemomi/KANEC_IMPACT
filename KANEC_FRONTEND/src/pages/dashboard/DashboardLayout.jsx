import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  DollarSign, 
  Sparkles, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  X,
  Wallet,
  Globe,
  Search,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { API_CONFIG, API_BASE_URL } from '../../api/config';
import axios from 'axios';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [hbarBalance, setHbarBalance] = useState('0.00');
  const [balanceLoading, setBalanceLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  // Fetch HBAR balance
  useEffect(() => {
    fetchHbarBalance();
  }, []);

  const fetchHbarBalance = async () => {
    try {
      const { data } = await axios({
        method: API_CONFIG.p2p.balance.method,
        url: `${API_BASE_URL}${API_CONFIG.p2p.balance.url}`,
      });
      
      // Use the balance_hbar field from the response
      setHbarBalance(data.balance_hbar?.toLocaleString() || '0.00');
    } catch (error) {
      console.error('Failed to fetch HBAR balance:', error);
      setHbarBalance('0.00'); // Fallback
    } finally {
      setBalanceLoading(false);
    }
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: FolderKanban, label: 'Projects', path: '/dashboard/projects' },
    { icon: DollarSign, label: 'Donations', path: '/dashboard/donations' },
    { icon: Sparkles, label: 'AI Insights', path: '/dashboard/insights' },
    { icon: FileText, label: 'Impact Reports', path: '/dashboard/reports' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  // Get current page title based on route
  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => 
      location.pathname === item.path || 
      (item.path !== '/dashboard' && location.pathname.startsWith(item.path))
    );
    return currentItem ? currentItem.label : 'Dashboard';
  };

  const handleLogout = () => {
    console.log('Logging out...');
    logout();
    navigate("/signin");
  };

  const getUserInitials = () => {
    if (!user?.name) return 'U';
    return user.name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-section">
            <img 
              src="/reallogo.png" 
              alt="KANEC IMPACT LEDGER" 
              className="logo-image"
            />
            <div className="logo-text">
              <div className="logo-title">KANEC</div>
              <div className="logo-subtitle">IMPACT LEDGER</div>
            </div>
          </div>
          <button className="close-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          {/* Theme Toggle in Sidebar */}
          <div className="theme-toggle-sidebar">
            <button 
              className={`theme-toggle-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
              <span>{theme === 'light' ? 'Light' : 'Dark'} Mode</span>
            </button>
          </div>

          <div className="user-balance">
            <div className="balance-icon">
              <Wallet size={20} />
            </div>
            <div className="balance-info">
              <div className="balance-label">HBAR Balance</div>
              <div className="balance-amount">
                {balanceLoading ? 'Loading...' : hbarBalance}
              </div>
            </div>
          </div>

          <div className="user-profile">
            <div className="user-avatar">{getUserInitials()}</div>
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-handle">@{user?.email?.split('@')[0] || 'user'}</div>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={24} />
          </button>

          {/* Current Page Title */}
          <div className="current-page-container">
            <h1 className="current-page-title">{getCurrentPageTitle()}</h1>
          </div>

          <div className="header-actions">
            <button 
              className="theme-toggle-header"
              onClick={toggleTheme}
            >
              {theme === 'light' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            
            <button className="network-btn">
              <Globe size={16} />
              <span>Hedera Mainnet</span>
            </button>
            <div className="wallet-address">
              <Wallet size={16} className="wallet-icon" />
              <span>{user?.wallet_address}</span>
            </div>
            {/* Remove notification badge since no endpoint exists */}
            <div className="user-avatar-small">{getUserInitials()}</div>
          </div>
        </header>

        <div className="dashboard-content">
          <Outlet />
        </div>
      </main>

      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default DashboardLayout;