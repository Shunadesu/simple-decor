import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { calculateCartTotal, getDefaultCurrency } from '../utils/currency';

const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],
      isLoading: false,
      error: null,
      currency: getDefaultCurrency(), // Default currency
      
      // Actions
      addItem: (product, quantity = 1) => {
        const { items, currency } = get();
        const existingItem = items.find(item => item.id === product.id);
        
        // Ensure product has currency information
        const productWithCurrency = {
          ...product,
          price: {
            amount: product.price?.amount || product.price || 0,
            currency: product.price?.currency || product.currency || currency
          },
          quantity
        };
        
        if (existingItem) {
          // Update quantity if item already exists
          const updatedItems = items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
          set({ items: updatedItems });
        } else {
          // Add new item with currency info
          set({ items: [...items, productWithCurrency] });
        }
      },
      
      removeItem: (productId) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.id !== productId);
        set({ items: updatedItems });
      },
      
      updateQuantity: (productId, quantity) => {
        const { items } = get();
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        const updatedItems = items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const { items, currency } = get();
        const result = calculateCartTotal(items, currency);
        return result.amount;
      },

      getTotalPriceWithCurrency: () => {
        const { items, currency } = get();
        return calculateCartTotal(items, currency);
      },

      setCurrency: (newCurrency) => {
        set({ currency: newCurrency });
      },
      
      getItemCount: () => {
        const { items } = get();
        return items.length;
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        currency: state.currency,
      }),
    }
  )
);

export default useCartStore; 