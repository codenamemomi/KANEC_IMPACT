// src/api/index.js
import client from './client';
import { API_CONFIG, API_BASE_URL } from './config';

/**
 * Safely builds full URL: base + endpoint
 * Prevents: //, duplicate /api/v1/, trailing/leading slash issues
 */
const buildUrl = (path) => {
  // Remove leading slash from endpoint path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;

  // Ensure base has no trailing slash
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;

  // Combine: exactly one slash between
  return `${base}/${cleanPath}`;
};

/**
 * Universal API caller
 * @param {Object|Function} endpoint - e.g. API_CONFIG.auth.login or () => API_CONFIG.projects.get(id)
 * @param {Object} options - { params, data, headers, ... }
 */
export const call = async (endpoint, { params, data, ...rest } = {}) => {
  const { method, url } =
    typeof endpoint === 'function' ? endpoint() : endpoint;

  try {
    const response = await client({
      method,
      url: buildUrl(url),
      params,
      data,
      ...rest,
    });
    return response.data;
  } catch (error) {
    // Log full error for debugging
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
    });
    throw error;
  }
};

// Export call + all endpoints for easy access
export default {
  call,
  ...API_CONFIG,
};