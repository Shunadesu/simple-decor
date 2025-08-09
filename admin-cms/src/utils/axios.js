import axios from 'axios';

// Cấu hình base URL cho API
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000,
});

// Function to get token from admin storage
const getAuthToken = () => {
  try {
    console.log('🔍 [AUTH] Checking for admin token...');
    
    // Method 1: Check admin_token in localStorage (AuthContext)
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      console.log('✅ [AUTH] Admin token found in localStorage:', adminToken.substring(0, 20) + '...');
      return adminToken;
    }
    
    // Method 2: Check auth-storage (Zustand persist)
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        if (parsed.state && parsed.state.token) {
          console.log('✅ [AUTH] Token found in auth-storage:', parsed.state.token.substring(0, 20) + '...');
          
          // Sync to localStorage for consistency
          if (!adminToken) {
            console.log('🔄 [AUTH] Syncing token from Zustand to localStorage');
            localStorage.setItem('admin_token', parsed.state.token);
          }
          
          return parsed.state.token;
        }
      } catch (parseError) {
        console.warn('⚠️ [AUTH] Failed to parse auth-storage:', parseError);
      }
    }
    
    console.warn('❌ [AUTH] No token found in any storage');
    console.log('📋 [AUTH] Available localStorage keys:', Object.keys(localStorage));
    console.log('📋 [AUTH] Full localStorage content:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const value = localStorage.getItem(key);
      console.log(`  - ${key}:`, value?.length > 100 ? `${value.substring(0, 100)}...` : value);
    }
    
  } catch (error) {
    console.error('💥 [AUTH] Could not get admin token:', error);
  }
  
  return null;
};

// Interceptor để thêm token vào header
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 [REQUEST] ${config.method?.toUpperCase()} ${config.url}`);
    const token = getAuthToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [REQUEST] Authorization header set:', config.headers.Authorization.substring(0, 30) + '...');
    } else {
      console.warn('⚠️ [REQUEST] No token available, request will be sent without authorization');
    }
    
    console.log('📤 [REQUEST] Headers:', config.headers);
    console.log('📦 [REQUEST] Body:', config.data);
    return config;
  },
  (error) => {
    console.error('💥 [REQUEST] Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Interceptor để xử lý response
api.interceptors.response.use(
  (response) => {
    console.log(`✅ [RESPONSE] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    console.log('📥 [RESPONSE] Data:', response.data);
    return response;
  },
  (error) => {
    console.error('💥 [RESPONSE] Error occurred:');
    console.error('📍 [RESPONSE] Status:', error.response?.status);
    console.error('📝 [RESPONSE] Data:', error.response?.data);
    console.error('🔗 [RESPONSE] URL:', error.config?.url);
    console.error('📋 [RESPONSE] Full error:', error);
    
    if (error.response?.status === 401) {
      console.warn('🔒 [AUTH] 401 Unauthorized - clearing admin token');
      // Clear admin token for admin-cms
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Debug function to manually test login
window.debugLogin = async () => {
  try {
    console.log('🧪 [DEBUG] Testing manual login...');
    const response = await api.post('/api/admin/login', {
      username: 'admin',
      password: 'password'
    });
    
    console.log('✅ [DEBUG] Login successful:', response.data);
    
    // Manually save token
    if (response.data.token) {
      localStorage.setItem('admin_token', response.data.token);
      console.log('💾 [DEBUG] Token saved to localStorage');
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ [DEBUG] Login failed:', error);
    return null;
  }
};

// Debug function to check current auth state
window.debugAuth = () => {
  console.log('🔍 [DEBUG] Current auth state:');
  console.log('  - admin_token:', localStorage.getItem('admin_token')?.substring(0, 30));
  console.log('  - auth-storage:', localStorage.getItem('auth-storage')?.substring(0, 100));
  
  // Try to get token through our function
  const token = getAuthToken();
  console.log('  - getAuthToken result:', token?.substring(0, 30));
};

export default api; 