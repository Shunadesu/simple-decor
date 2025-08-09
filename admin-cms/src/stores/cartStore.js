import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../utils/axios';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      userCarts: {}, // { userId: cartData }
      isLoading: false,
      error: null,
      
      // Actions
      fetchUserCart: async (userId) => {
        try {
          set({ isLoading: true, error: null });
          
          console.log('Fetching cart for user:', userId);
          
          const response = await api.get(`/api/carts/user/${userId}`);
          const cart = response.data.cart;
          
          console.log('Cart fetched successfully:', cart);
          
          // Update userCarts state
          const { userCarts } = get();
          set({
            userCarts: {
              ...userCarts,
              [userId]: cart
            },
            isLoading: false,
            error: null
          });
          
          return { success: true, data: cart };
        } catch (error) {
          console.error('Failed to fetch user cart:', error.response?.data || error.message);
          set({
            isLoading: false,
            error: error.response?.data?.message || 'Failed to fetch user cart'
          });
          return { 
            success: false, 
            error: error.response?.data?.message || 'Failed to fetch user cart' 
          };
        }
      },
      
      getUserCart: (userId) => {
        const { userCarts } = get();
        return userCarts[userId] || null;
      },
      
      clearUserCart: (userId) => {
        const { userCarts } = get();
        const newUserCarts = { ...userCarts };
        delete newUserCarts[userId];
        set({ userCarts: newUserCarts });
      },
      
      clearError: () => {
        set({ error: null });
      },
      
      clearAllCarts: () => {
        set({ userCarts: {} });
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        userCarts: state.userCarts,
      }),
    }
  )
);

export default useCartStore; 