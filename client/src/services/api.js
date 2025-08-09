import axios from 'axios';

const API_BASE_URL = 'https://simple-decor.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url, 'with params:', config.params);
    
    // Automatically add auth token if available
    const authStorage = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    const token = authStorage.state?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.status, error.response?.data);
    
    // Handle token expiration
    if (error.response?.status === 401) {
      const errorMessage = error.response?.data?.message;
      if (errorMessage === 'Invalid token' || errorMessage === 'Token expired') {
        // Clear auth storage and redirect to login
        localStorage.removeItem('auth-storage');
        // Don't redirect immediately as it might cause infinite loops
        // Let the component handle the logout
        console.warn('Token expired or invalid. User needs to login again.');
      }
    }
    
    return Promise.reject(error);
  }
);

class BaseApiService {
  constructor() {
    this.retryDelays = [1000, 2000, 5000]; // Retry delays in milliseconds
    this.requestCache = new Map(); // Simple cache for requests
  }

  async request(endpoint, options = {}) {
    let lastError;
    
    for (let attempt = 0; attempt <= this.retryDelays.length; attempt++) {
      try {
        const response = await api.request({
          url: endpoint,
          method: options.method || 'GET',
          data: options.data,
          params: options.params,
          headers: options.headers,
        });
        
        return response.data;
      } catch (error) {
        lastError = error;
        
        // If it's a rate limit error and we haven't exhausted retries
        if (error.response?.status === 429 && attempt < this.retryDelays.length) {
          const delay = this.retryDelays[attempt];
          console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${attempt + 1}/${this.retryDelays.length + 1})`);
          await this.sleep(delay);
          continue;
        }
        
        // For other errors or if we've exhausted retries, break
        break;
      }
    }
    
    // If we get here, all retries failed
    console.error('API request failed after all retries:', lastError);
    
    if (lastError.response) {
      // Server responded with error status
      const errorMessage = lastError.response.data?.message || `HTTP error! status: ${lastError.response.status}`;
      throw new Error(errorMessage);
    } else if (lastError.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error(lastError.message || 'An unexpected error occurred');
    }
  }

  // Helper method to sleep
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default BaseApiService; 