import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { API_CONFIG } from '../config/api.config';

// 🔥 HARDCODED NGROK URL FOR TESTING
const HARDCODED_NGROK_URL = 'https://chromoplasmic-ungaping-danielle.ngrok-free.dev/api/v1';

console.log('🔥 USING HARDCODED NGROK URL:', HARDCODED_NGROK_URL);

// Create axios instance
export const api = axios.create({
  baseURL: HARDCODED_NGROK_URL, // Using hardcoded URL instead of API_CONFIG.API_BASE_URL
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    'User-Agent': 'BTMTravel-COBT',
  },
  timeout: 30000,
});

// Request interceptor - Add auth token and ngrok headers
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log the full request URL
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log('🌐 Making request to:', fullUrl);
    console.log('📋 Request headers:', config.headers);
    
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Add ngrok header to skip browser warning
    if (config.headers) {
      config.headers['ngrok-skip-browser-warning'] = 'true';
      config.headers['User-Agent'] = 'BTMTravel-COBT';
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle network errors (backend not reachable)
    if (!error.response) {
      // Log the error details
      console.error('❌ Network Error Details:');
      console.error('   Error code:', error.code);
      console.error('   Error message:', error.message);
      console.error('   Request URL:', originalRequest.url);
      console.error('   Base URL:', originalRequest.baseURL);
      console.error('   Full URL:', `${originalRequest.baseURL}${originalRequest.url}`);
      
      // Silently fail for health checks - no console errors
      if (originalRequest.url?.includes('/health')) {
        return Promise.reject(error);
      }

      // Show user-friendly toast
      toast.error('Cannot connect to server. Please ensure the backend is running.');
      return Promise.reject(error);
    }

    // Handle 401 Unauthorized - Try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(`${HARDCODED_NGROK_URL}/auth/refresh`, {
          refreshToken,
        }, {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        toast.error('Session expired. Please login again.');
        
        // Redirect to login page
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      
      // Don't show toast for 401 (already handled above)
      if (error.response.status !== 401) {
        toast.error(Array.isArray(message) ? message[0] : message);
      }
    } else if (error.request) {
      // Request made but no response received
      toast.error('Unable to connect to server. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred');
    }

    return Promise.reject(error);
  }
);

export default api;
