import { useState, useEffect } from 'react';
import { User, Wallet, Bell, Sun, Moon, LogOut, Save, Key, Trash2 } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { API_CONFIG, API_BASE_URL } from '../../api/config';
import axios from 'axios';
import { toast } from 'sonner';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Profile state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Delete account state
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Notification preferences (you might want to fetch these from an API)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [donationAlerts, setDonationAlerts] = useState(true);
  const [monthlyReports, setMonthlyReports] = useState(true);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

  // Fetch user profile data
  const fetchUserProfile = async () => {
    try {
      const { data } = await axios({
        method: API_CONFIG.auth.profile.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.profile.url}`,
      });
      
      if (data) {
        setName(data.name || '');
        setEmail(data.email || '');
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load profile data');
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      const updateData = {};
      if (name && name !== user?.name) updateData.name = name;
      if (email && email !== user?.email) updateData.email = email;

      if (Object.keys(updateData).length === 0) {
        toast.info('No changes to save');
        return;
      }

      const { data } = await axios({
        method: API_CONFIG.auth.updateProfile.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.updateProfile.url}`,
        data: updateData,
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      
      // If email was changed, user might need to verify it
      if (updateData.email && updateData.email !== user?.email) {
        toast.info('Please verify your new email address');
      }

    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to update profile';
      toast.error(errorMsg);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      await axios({
        method: API_CONFIG.auth.changePassword.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.changePassword.url}`,
        data: {
          current_password: currentPassword,
          new_password: newPassword,
        },
      });

      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangingPassword(false);

    } catch (error) {
      console.error('Failed to change password:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to change password';
      toast.error(errorMsg);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Please enter your password to confirm account deletion');
      return;
    }

    try {
      await axios({
        method: API_CONFIG.auth.deleteAccount.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.deleteAccount.url}?password=${encodeURIComponent(deletePassword)}`,
      });

      toast.success('Account deleted successfully');
      logout();

    } catch (error) {
      console.error('Failed to delete account:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.message || 'Failed to delete account';
      toast.error(errorMsg);
    }
  };

  // Wallet disconnect (placeholder - you might want to implement this)
  const handleDisconnectWallet = () => {
    toast.info('Wallet disconnect functionality coming soon');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="settings-content">
        {/* Profile Information */}
        <div className="settings-section">
          <div className="section-header">
            <User className="section-icon" />
            <h2>Profile Information</h2>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="edit-button"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          <div className="settings-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="input-field"
                disabled={!isEditing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                className="input-field"
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <button onClick={handleUpdateProfile} className="save-button">
                <Save size={16} />
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Password Change */}
        <div className="settings-section">
          <div className="section-header">
            <Key className="section-icon" />
            <h2>Change Password</h2>
            <button 
              onClick={() => setIsChangingPassword(!isChangingPassword)}
              className="edit-button"
            >
              {isChangingPassword ? 'Cancel' : 'Change'}
            </button>
          </div>

          {isChangingPassword && (
            <div className="settings-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="input-field"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="input-field"
                />
              </div>

              <button onClick={handleChangePassword} className="save-button">
                Update Password
              </button>
            </div>
          )}
        </div>

        {/* Wallet Connection */}
        <div className="settings-section">
          <div className="section-header">
            <Wallet className="section-icon" />
            <h2>Wallet Connection</h2>
          </div>

          <div className="wallet-info">
            <div className="wallet-item">
              <div className="wallet-detail">
                <span className="wallet-label">Connected Wallet</span>
                <span className="wallet-address">
                  {user?.wallet_address ? `${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}` : 'Not connected'}
                </span>
              </div>
              <button 
                onClick={handleDisconnectWallet}
                className="disconnect-button"
                disabled={!user?.wallet_address}
              >
                Disconnect
              </button>
            </div>

            <div className="wallet-item">
              <div className="wallet-detail">
                <span className="wallet-label">Network</span>
                <span className="wallet-network">Hedera Mainnet</span>
              </div>
              <span className={`status-badge ${user?.wallet_address ? 'connected' : 'disconnected'}`}>
                {user?.wallet_address ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="settings-section">
          <div className="section-header">
            <Bell className="section-icon" />
            <h2>Notifications</h2>
          </div>

          <div className="notification-settings">
            <div className="notification-item">
              <div className="notification-info">
                <h3>Email Notifications</h3>
                <p>Receive updates via email</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h3>Donation Alerts</h3>
                <p>Get notified about your donations</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={donationAlerts}
                  onChange={(e) => setDonationAlerts(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="notification-item">
              <div className="notification-info">
                <h3>Monthly Reports</h3>
                <p>Receive monthly impact summaries</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={monthlyReports}
                  onChange={(e) => setMonthlyReports(e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="settings-section">
          <div className="section-header">
            <Sun className="section-icon" />
            <h2>Appearance</h2>
          </div>

          <div className="appearance-settings">
            <div className="theme-info">
              <h3>Theme</h3>
              <p>Switch between light and dark mode</p>
            </div>
            <div className="theme-toggle">
              <button
                className={`theme-button ${theme === 'light' ? 'active' : ''}`}
                onClick={toggleTheme}
              >
                <Sun className="theme-icon" />
                Light
              </button>
              <button
                className={`theme-button ${theme === 'dark' ? 'active' : ''}`}
                onClick={toggleTheme}
              >
                <Moon className="theme-icon" />
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="settings-section danger-zone">
          <div className="danger-header">
            <Trash2 className="danger-icon" />
            Danger Zone
          </div>
          
          <div className="danger-content">
            <div className="danger-item">
              <div className="danger-info">
                <h3>Logout</h3>
                <p>Sign out of your account</p>
              </div>
              <button 
                onClick={handleLogout}
                className="logout-button"
              >
                <LogOut className="logout-icon" />
                Logout
              </button>
            </div>

            <div className="danger-item">
              <div className="danger-info">
                <h3>Delete Account</h3>
                <p>Permanently delete your account and all data</p>
              </div>
              <button 
                onClick={() => setShowDeleteConfirm(true)}
                className="delete-button"
              >
                <Trash2 className="delete-icon" />
                Delete Account
              </button>
            </div>
          </div>

          {/* Delete Account Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3>Delete Account</h3>
                <p>This action cannot be undone. Please enter your password to confirm.</p>
                
                <div className="form-group">
                  <label htmlFor="deletePassword">Password</label>
                  <input
                    id="deletePassword"
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password"
                    className="input-field"
                  />
                </div>

                <div className="modal-actions">
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleDeleteAccount}
                    className="confirm-delete-button"
                    disabled={!deletePassword}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;