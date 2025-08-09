import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../utils/axios';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      lastActivity: null,
      isHydrated: false,
      
      // Actions
      login: async (credentials) => {
        try {
          set({ isLoading: true });
          
          const response = await api.post('/api/admin/login', credentials);
          const { user, admin, token } = response.data;
          
          // Handle both user and admin field from API response
          const userData = user || admin;
          
          console.log('🔍 [LOGIN] Login response:', { 
            hasUser: !!userData, 
            hasToken: !!token,
            tokenLength: token?.length,
            userData 
          });
          
          // Set current time as last activity
          const now = new Date().getTime();
          
          set({
            user: userData,
            token,
            isAuthenticated: true,
            isLoading: false,
            lastActivity: now,
          });
          
          // Set token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Also save to localStorage for axios interceptor compatibility
          localStorage.setItem('admin_token', token);
          
          console.log('Token saved to store, axios headers, and localStorage');
          
          return { success: true };
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Login failed' 
          };
        }
      },
      
      logout: () => {
        // Clear token from axios headers
        delete api.defaults.headers.common['Authorization'];
        
        // Clear token from localStorage
        localStorage.removeItem('admin_token');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          lastActivity: null,
        });
      },
      
      updateActivity: () => {
        const now = new Date().getTime();
        set({ lastActivity: now });
      },
      
      checkSessionExpiry: () => {
        const { lastActivity } = get();
        if (!lastActivity) return false;
        
        const now = new Date().getTime();
        const threeDaysInMs = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
        const timeSinceLastActivity = now - lastActivity;
        
        if (timeSinceLastActivity > threeDaysInMs) {
          get().logout();
          return true; // Session expired
        }
        
        return false; // Session still valid
      },
      
      setHydrated: () => {
        const { token, user } = get();
        console.log('Hydrating auth state:', { token: !!token, user: !!user });
        
        if (token && user) {
          // Set token in axios headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Check if session is expired
          const isExpired = get().checkSessionExpiry();
          if (!isExpired) {
            console.log('Session valid, setting authenticated');
            set({ isAuthenticated: true, isHydrated: true });
          } else {
            console.log('Session expired, clearing auth');
            set({ isHydrated: true });
          }
        } else {
          console.log('No stored auth data');
          set({ isHydrated: true });
        }
      },
      
      refreshToken: async () => {
        try {
          const response = await api.post('/api/admin/refresh-token');
          const { token } = response.data;
          
          set({ token });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          return { success: true };
        } catch (error) {
          get().logout();
          return { success: false };
        }
      },
      
      updateUser: (userData) => {
        set({ user: userData });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      // Initialize auth state from stored data
      initializeAuth: async () => {
        console.log('🔄 [INIT] Initializing auth store...');
        
        const { token, user } = get();
        const localToken = localStorage.getItem('admin_token');
        
        console.log('📊 [INIT] Auth state check:', {
          hasStoreToken: !!token,
          hasStoreUser: !!user,
          hasLocalToken: !!localToken,
          tokenLength: token?.length,
          localTokenLength: localToken?.length
        });
        
        if (token && user) {
          try {
            console.log('✅ [INIT] Found stored auth, verifying with backend...');
            
            // Verify token with backend
            const response = await api.get('/api/admin/profile');
            const currentUser = response.data;
            
            // Update user data and set authenticated
            set({ 
              user: currentUser, 
              isAuthenticated: true, 
              isHydrated: true,
              lastActivity: new Date().getTime()
            });
            
            // Set token in axios headers
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Sync with localStorage
            if (!localToken) {
              console.log('🔄 [INIT] Syncing token to localStorage');
              localStorage.setItem('admin_token', token);
            }
            
            console.log('✅ [INIT] Auth initialized successfully');
          } catch (error) {
            console.warn('❌ [INIT] Token verification failed:', {
              status: error.response?.status,
              message: error.response?.data?.message,
              error: error.message
            });
            console.log('🧹 [INIT] Clearing invalid auth state');
            get().logout();
            set({ isHydrated: true });
          }
        } else {
          console.log('⚠️ [INIT] No stored auth found, setting hydrated');
          set({ isHydrated: true });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        lastActivity: state.lastActivity,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('💾 [REHYDRATE] Starting storage rehydration...');
        if (state) {
          console.log('📊 [REHYDRATE] Rehydrated state:', {
            hasUser: !!state.user,
            hasToken: !!state.token,
            tokenLength: state.token?.length,
            isAuthenticated: state.isAuthenticated,
            lastActivity: state.lastActivity
          });
          
          // Initialize auth after rehydration
          setTimeout(() => {
            console.log('🚀 [REHYDRATE] Triggering initializeAuth...');
            state.initializeAuth();
          }, 0);
        } else {
          console.warn('❌ [REHYDRATE] No state to rehydrate');
        }
      },
      onFinishHydration: (state) => {
        console.log('✅ [REHYDRATE] Finished hydrating auth state:', { 
          hasUser: !!state?.user, 
          hasToken: !!state?.token,
          tokenLength: state?.token?.length,
          isAuthenticated: state?.isAuthenticated,
          isHydrated: state?.isHydrated
        });
        
        // Also check localStorage sync
        const localToken = localStorage.getItem('admin_token');
        console.log('💾 [REHYDRATE] localStorage admin_token:', localToken ? localToken.substring(0, 20) + '...' : 'None');
      },
    }
  )
);

export default useAuthStore; 