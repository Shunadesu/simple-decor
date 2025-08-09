import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../utils/axios';

const useUserStore = create(
  persist(
    (set, get) => ({
      // State
      users: [],
      currentUser: null,
      isLoading: false,
      error: null,
      lastFetch: null,
      
      // Actions
      fetchUsers: async (forceRefresh = false) => {
        const { lastFetch, users } = get();
        const now = Date.now();
        const fiveMinutes = 5 * 60 * 1000; // 5 minutes cache
        
        // Return cached data if not expired and not forcing refresh
        if (!forceRefresh && lastFetch && (now - lastFetch) < fiveMinutes && Array.isArray(users) && users.length > 0) {
          return { success: true, data: users };
        }
        
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.get('/api/users');
          let fetchedUsers = [];
          
          // Handle different response structures
          if (response.data && Array.isArray(response.data.users)) {
            fetchedUsers = response.data.users;
          } else if (Array.isArray(response.data)) {
            fetchedUsers = response.data;
          } else if (response.data && typeof response.data === 'object') {
            // If response.data is an object, try to find users array
            fetchedUsers = response.data.users || response.data.data || [];
          }
          
          // Ensure fetchedUsers is always an array
          if (!Array.isArray(fetchedUsers)) {
            fetchedUsers = [];
          }
          
          set({
            users: fetchedUsers,
            isLoading: false,
            lastFetch: now,
            error: null
          });
          
          return { success: true, data: fetchedUsers };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch users'
          });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Failed to fetch users' 
          };
        }
      },
      
      createUser: async (userData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.post('/api/users', userData);
          const newUser = response.data.user || response.data;
          
          // Add to local state
          const { users } = get();
          const currentUsers = Array.isArray(users) ? users : [];
          set({
            users: [...currentUsers, newUser],
            isLoading: false,
            error: null
          });
          
          return { success: true, data: newUser };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to create user'
          });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Failed to create user' 
          };
        }
      },
      
      updateUser: async (userId, userData) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.put(`/api/users/${userId}`, userData);
          const updatedUser = response.data.user || response.data;
          
          // Update in local state
          const { users } = get();
          const currentUsers = Array.isArray(users) ? users : [];
          const updatedUsers = currentUsers.map(user => 
            user._id === userId ? updatedUser : user
          );
          
          set({
            users: updatedUsers,
            isLoading: false,
            error: null
          });
          
          return { success: true, data: updatedUser };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to update user'
          });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Failed to update user' 
          };
        }
      },
      
      deleteUser: async (userId) => {
        try {
          set({ isLoading: true, error: null });
          
          await api.delete(`/api/users/${userId}`);
          
          // Remove from local state
          const { users } = get();
          const currentUsers = Array.isArray(users) ? users : [];
          const filteredUsers = currentUsers.filter(user => user._id !== userId);
          
          set({
            users: filteredUsers,
            isLoading: false,
            error: null
          });
          
          return { success: true };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to delete user'
          });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Failed to delete user' 
          };
        }
      },
      
      updateUserStatus: async (userId, status) => {
        try {
          set({ isLoading: true, error: null });
          
          const response = await api.patch(`/api/users/${userId}/status`, { status });
          const updatedUser = response.data.user || response.data;
          
          // Update in local state
          const { users } = get();
          const currentUsers = Array.isArray(users) ? users : [];
          const updatedUsers = currentUsers.map(user => 
            user._id === userId ? updatedUser : user
          );
          
          set({
            users: updatedUsers,
            isLoading: false,
            error: null
          });
          
          return { success: true, data: updatedUser };
        } catch (error) {
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to update user status'
          });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Failed to update user status' 
          };
        }
      },
      
      getUserById: (userId) => {
        const { users } = get();
        const currentUsers = Array.isArray(users) ? users : [];
        return currentUsers.find(user => user._id === userId);
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      clearUsers: () => {
        set({ users: [], lastFetch: null });
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        lastFetch: state.lastFetch,
      }),
      onRehydrateStorage: () => (state) => {
        // Ensure users is always an array when rehydrating
        if (state && !Array.isArray(state.users)) {
          console.log('🔧 Rehydrating userStore - fixing users array');
          state.users = [];
        }
      },
    }
  )
);

export default useUserStore; 