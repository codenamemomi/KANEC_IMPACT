// src/api/config.js
import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.konasalti.com/kanec';

export const API_CONFIG = {
  // ===================== AUTH ENDPOINTS =====================
  auth: {
    register: { method: 'POST', url: '/api/v1/auth/register' },
    login: { method: 'POST', url: '/api/v1/auth/login' },
    loginSwagger: { method: 'POST', url: '/api/v1/auth/login_swagger' },
    me: { method: 'GET', url: '/api/v1/auth/me' },
    exportWallet: { method: 'GET', url: '/api/v1/auth/export-wallet' },
    verifyEmail: { method: 'POST', url: '/api/v1/auth/verify-email' },
    resendVerification: { method: 'POST', url: '/api/v1/auth/resend-verification' },
    verificationStatus: { method: 'GET', url: '/api/v1/auth/verification-status' },
    profile: { method: 'GET', url: '/api/v1/auth/profile' },
    updateProfile: { method: 'PUT', url: '/api/v1/auth/profile' },
    partialUpdateProfile: { method: 'PATCH', url: '/api/v1/auth/profile' },
    changePassword: { method: 'POST', url: '/api/v1/auth/change-password' },
    deleteAccount: { method: 'DELETE', url: '/api/v1/auth/account' },
    forgotPassword: { method: 'POST', url: '/api/v1/auth/forgot-password' },
    resetPassword: { method: 'POST', url: '/api/v1/auth/reset-password' },
  },

  // ===================== PROJECTS ENDPOINTS =====================
  projects: {
    list: { method: 'GET', url: '/api/v1/projects/' },
    create: { method: 'POST', url: '/api/v1/projects/' },
    uploadImage: (project_id) => ({ method: 'POST', url: `/api/v1/projects/${project_id}/image` }),
    get: (project_id) => ({ method: 'GET', url: `/api/v1/projects/${project_id}` }),
    transparency: (project_id) => ({ method: 'GET', url: `/api/v1/projects/${project_id}/transparency` }),
    verify: (project_id) => ({ method: 'PATCH', url: `/api/v1/projects/${project_id}/verify` }),
  },

  // ===================== DONATIONS =====================
  donations: {
    make: { method: 'POST', url: '/api/v1/donations/' },
  },

  // ===================== TRACE =====================
  trace: {
    get: (tx_hash) => ({ method: 'GET', url: `/api/v1/trace/trace/${tx_hash}` }),
  },

  // ===================== P2P TRANSFERS =====================
  p2p: {
    transfer: { method: 'POST', url: '/api/v1/p2p/transfer' },
    balance: { method: 'GET', url: '/api/v1/p2p/balance' },
    validateWallet: { method: 'POST', url: '/api/v1/p2p/validate-wallet' },
  },

  // ===================== ANALYTICS =====================
  analytics: {
    userInsights: { method: 'GET', url: '/api/v1/analytics/user/insights' },
    globalStats: { method: 'GET', url: '/api/v1/analytics/global/stats' },
    platformOverview: { method: 'GET', url: '/api/v1/analytics/platform/overview' },
    project: (project_id) => ({ method: 'GET', url: `/api/v1/analytics/project/${project_id}` }),
    topCategories: { method: 'GET', url: '/api/v1/analytics/categories/top' },
    compareUser: { method: 'GET', url: '/api/v1/analytics/user/compare' },
  },

  // ===================== DEFAULT =====================
  health: { method: 'GET', url: '/' },
};

// CRITICAL: Force JSON Content-Type for all POST/PUT/PATCH requests
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';

// Helper to build full URL
export const buildUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;