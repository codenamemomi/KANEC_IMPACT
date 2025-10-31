// src/api/client.js
import axios from 'axios';
import { API_BASE_URL } from './config';

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000, // 12 seconds
  headers: { 'Content-Type': 'application/json' },
});

// Use sessionStorage to match SignInPage
client.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default client;