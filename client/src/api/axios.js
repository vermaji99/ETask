import axios from 'axios';

const isProduction = import.meta.env.PROD;

const API = axios.create({
  baseURL: isProduction ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api'),
});

API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Standardize error response
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    const specificErrors = error.response?.data?.errors || null;
    
    // Create a custom error object to be handled by components
    const enhancedError = new Error(message);
    enhancedError.response = error.response;
    enhancedError.specificErrors = specificErrors;
    
    // Log for developers
    if (!isProduction) {
      console.error('[API Error]', {
        url: error.config?.url,
        message,
        specificErrors,
        status: error.response?.status
      });
    }

    return Promise.reject(enhancedError);
  }
);

export default API;
