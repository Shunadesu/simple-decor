import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      // Actions
      login: async (credentials) => {
        try {
          set({ isLoading: true });
          
          // Simulate API call - replace with actual API
          const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
          }
          
          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message || 'Login failed' });
          return { 
            success: false, 
            error: error.message || 'Login failed' 
          };
        }
      },
      
      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
      
      register: async (userData) => {
        try {
          set({ isLoading: true });
          
          // Simulate API call - replace with actual API
          const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Registration failed');
          }
          
          const data = await response.json();
          
          set({
            user: data.user,
            token: data.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: error.message || 'Registration failed' });
          return { 
            success: false, 
            error: error.message || 'Registration failed' 
          };
        }
      },
      
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },
      
      updateProfile: async (profileData) => {
        try {
          set({ isLoading: true });
          const { token } = get();
          
          if (!token) {
            throw new Error('No authentication token');
          }
          
          // Prepare the data to send
          const updateData = {
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            phone: profileData.phone,
          };
          
          // Add password change if provided
          if (profileData.currentPassword && profileData.newPassword) {
            updateData.currentPassword = profileData.currentPassword;
            updateData.newPassword = profileData.newPassword;
          }
          
          const response = await fetch('http://localhost:5000/api/users/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updateData),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Profile update failed');
          }
          
          const data = await response.json();
          
          // Update the user in state
          set({ 
            user: { ...get().user, ...data.user },
            isLoading: false 
          });
          
          return { success: true, user: data.user };
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore; 