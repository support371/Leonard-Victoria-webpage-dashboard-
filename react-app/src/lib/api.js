import axios from 'axios';
import { supabase } from './supabase';

const API_BASE = import.meta.env.VITE_API_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach Supabase session token to every request
apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data.session?.access_token) {
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Request failed';
    return Promise.reject(new Error(message));
  }
);

// Default export so callers can `import api from '../lib/api'`
export default apiClient;
