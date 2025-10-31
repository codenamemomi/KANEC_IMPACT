import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG, API_BASE_URL } from '../api/config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check if token is expired
  const isTokenExpired = (token) => {
    try {
      if (!token) return true;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      const isExpired = payload.exp * 1000 < Date.now();
      
      console.log('Token expiration check:', {
        issued: new Date(payload.iat * 1000),
        expires: new Date(payload.exp * 1000),
        now: new Date(),
        isExpired
      });
      
      return isExpired;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };

  // Add axios interceptor for authentication
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      console.log('Axios request interceptor - Token present:', !!token);
      
      if (token && !isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Added Authorization header with token');
      } else if (token) {
        console.log('Token expired, clearing...');
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Auth check - Token from localStorage:', token ? 'Present' : 'Missing');
      
      if (!token) {
        console.log('No token found');
        setLoading(false);
        return;
      }

      if (isTokenExpired(token)) {
        console.log('Token expired, clearing...');
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        setLoading(false);
        return;
      }

      console.log('Making auth/me request...');
      
      // Make the request with explicit headers to ensure token is sent
      const { data } = await axios({
        method: API_CONFIG.auth.me.method,
        url: `${API_BASE_URL}${API_CONFIG.auth.me.url}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Auth check successful, user data:', data);
      setUser(data);

    } catch (error) {
      console.error('Auth check failed:', error);
      console.error('Error details:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      
      // Clear token on auth failure
      localStorage.removeItem('token');
      localStorage.removeItem('isAuthenticated');
      sessionStorage.clear();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    console.log('Login function called with:', { 
      userEmail: userData.email, 
      tokenLength: token.length,
      tokenPreview: token.substring(0, 20) + '...'
    });
    
    // Store token
    localStorage.setItem('token', token);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('isAuthenticated', 'true');
    
    setUser(userData);
    console.log('Login completed successfully');
  };

  const logout = () => {
    console.log('Logout initiated');
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
    console.log('Logout completed');
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};