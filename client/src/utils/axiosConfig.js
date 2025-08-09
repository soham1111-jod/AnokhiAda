import axios from 'axios';
import { TokenManager } from './tokenManager';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:3000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ✅ Smart request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Determine context based on URL
    const isAdminRequest = config.url?.includes('/admin') || 
                          config.url?.includes('/orders/admin');
    
    const context = isAdminRequest ? 'admin' : 'user';
    const token = TokenManager.getToken(context);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`🔑 Added ${context} token to request:`, config.url);
    } else {
      console.warn(`⚠️ No ${context} token found for request:`, config.url);
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Smart response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAdminRequest = error.config?.url?.includes('/admin') ||
                           window.location.pathname.includes('/admin');
      
      const context = isAdminRequest ? 'admin' : 'user';
      
      console.log(`🔑 401 error for ${context} - clearing tokens`);
      TokenManager.clearTokens(context);
      
      // Redirect to appropriate login
      const redirectPath = isAdminRequest ? '/admin/login' : '/login';
      window.location.href = redirectPath;
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
