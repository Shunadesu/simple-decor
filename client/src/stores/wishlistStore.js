import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import wishlistApi from '../services/wishlistApi';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      error: null,
      
      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),
      
      // Fetch wishlist from API
      fetchWishlist: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await wishlistApi.getWishlist();
          const wishlistItems = response.wishlist || [];
          set({ items: wishlistItems, isLoading: false });
          return wishlistItems;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      // Add product to wishlist
      addToWishlist: async (product) => {
        try {
          set({ isLoading: true, error: null });
          const response = await wishlistApi.addToWishlist(product._id || product.id);
          const { items } = get();
          
          // Check if product is already in local state
          const existingItem = items.find(item => 
            item.product._id === (product._id || product.id) || 
            item.product.id === (product._id || product.id)
          );
          
          if (!existingItem) {
            const newItem = {
              product: product,
              addedAt: new Date().toISOString()
            };
            set({ items: [...items, newItem], isLoading: false });
          }
          
          return response;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      // Remove product from wishlist
      removeFromWishlist: async (productId) => {
        try {
          set({ isLoading: true, error: null });
          await wishlistApi.removeFromWishlist(productId);
          const { items } = get();
          
          const updatedItems = items.filter(item => 
            item.product._id !== productId && 
            item.product.id !== productId
          );
          
          set({ items: updatedItems, isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      // Clear entire wishlist
      clearWishlist: async () => {
        try {
          set({ isLoading: true, error: null });
          await wishlistApi.clearWishlist();
          set({ items: [], isLoading: false });
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      
      // Toggle wishlist status
      toggleWishlist: async (product) => {
        try {
          const { items } = get();
          const productId = product._id || product.id;
          const existingItem = items.find(item => 
            item.product._id === productId || 
            item.product.id === productId
          );
          
          if (existingItem) {
            await get().removeFromWishlist(productId);
          } else {
            await get().addToWishlist(product);
          }
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },
      
      // Check if product is in wishlist
      isInWishlist: (productId) => {
        const { items } = get();
        return items.some(item => 
          item.product._id === productId || 
          item.product.id === productId
        );
      },
      
      // Get wishlist count
      getWishlistCount: () => {
        const { items } = get();
        return items.length;
      },
      
      // Get wishlist items
      getWishlistItems: () => {
        const { items } = get();
        return items;
      },
      
      // Sync wishlist with server
      syncWishlist: async () => {
        try {
          await get().fetchWishlist();
        } catch (error) {
          console.error('Failed to sync wishlist:', error);
        }
      },
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
      }),
    }
  )
);

export default useWishlistStore; 