import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { categoriesApi, productsApi } from '../services';

const useHomeStore = create(
  devtools(
    (set, get) => ({
      // State
      categories: [],
      featuredProducts: [],
      categoryProducts: [],
      loading: false,
      productsLoading: false,
      error: null,
      retrying: false,
      
      // View state
      currentView: 'categories', // 'categories' or 'products'
      selectedCategory: null,
      
      // Filters
      searchTerm: '',
      sortBy: 'createdAt',
      viewMode: 'grid',
      debouncedSearchTerm: '',
      
      // Cache
      categoriesCache: null,
      featuredProductsCache: null,
      categoryProductsCache: new Map(),
      lastFetchTime: null,
      cacheExpiry: 5 * 60 * 1000, // 5 minutes

      // Actions
      setLoading: (loading) => set({ loading }),
      setProductsLoading: (loading) => set({ productsLoading: loading }),
      setError: (error) => set({ error }),
      setRetrying: (retrying) => set({ retrying }),
      
      setCurrentView: (view) => set({ currentView: view }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setDebouncedSearchTerm: (term) => set({ debouncedSearchTerm: term }),

      // Fetch initial data (categories and featured products)
      fetchData: () => {
        const { categoriesCache, featuredProductsCache, lastFetchTime, cacheExpiry } = get();
        
        // Check cache
        if (categoriesCache && featuredProductsCache && lastFetchTime && (Date.now() - lastFetchTime) < cacheExpiry) {
          set({ 
            categories: categoriesCache, 
            featuredProducts: featuredProductsCache,
            loading: false 
          });
          return Promise.resolve({ success: true });
        }

        set({ loading: true, error: null, retrying: false });
        
        // Fetch categories and featured products in parallel
        return Promise.all([
          categoriesApi.getCategories({ active: true, limit: 6 }),
          productsApi.getFeaturedProducts(8)
        ])
        .then(([categoriesResponse, featuredResponse]) => {
          let categories = [];
          let featuredProducts = [];

          // Handle categories response
          if (categoriesResponse && categoriesResponse.success && categoriesResponse.data) {
            categories = categoriesResponse.data;
          } else if (categoriesResponse && categoriesResponse.categories) {
            categories = categoriesResponse.categories;
          } else if (Array.isArray(categoriesResponse)) {
            categories = categoriesResponse;
          }

          // Handle featured products response
          if (featuredResponse && featuredResponse.success && featuredResponse.data && featuredResponse.data.products) {
            featuredProducts = featuredResponse.data.products;
          } else if (featuredResponse && featuredResponse.products) {
            featuredProducts = featuredResponse.products;
          } else if (Array.isArray(featuredResponse)) {
            featuredProducts = featuredResponse;
          }
          
          set({ 
            categories, 
            featuredProducts,
            categoriesCache: categories,
            featuredProductsCache: featuredProducts,
            lastFetchTime: Date.now(),
            loading: false 
          });
          
          return { success: true };
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          
          // Check if it's a rate limit error
          if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
            set({ 
              error: 'Server is busy. Please wait a moment and try again.',
              retrying: true,
              loading: false 
            });
            
            // Auto-retry after 5 seconds
            setTimeout(() => {
              set({ retrying: false });
              get().fetchData();
            }, 5000);
          } else {
            set({ 
              error: 'Failed to load data. Please try again later.',
              categories: [],
              featuredProducts: [],
              loading: false 
            });
          }
          
          return { success: false, error: error.message };
        });
      },

      // Fetch products for a specific category
      fetchCategoryProducts: (categoryId, searchTerm = '', sortBy = 'createdAt') => {
        const { categoryProductsCache, cacheExpiry } = get();
        
        // Create cache key
        const cacheKey = `${categoryId}-${searchTerm}-${sortBy}`;
        
        // Check cache
        if (categoryProductsCache.has(cacheKey)) {
          const cachedData = categoryProductsCache.get(cacheKey);
          if (cachedData.timestamp && (Date.now() - cachedData.timestamp) < cacheExpiry) {
            set({ categoryProducts: cachedData.products, productsLoading: false });
            return Promise.resolve({ success: true, data: cachedData.products });
          }
        }

        set({ productsLoading: true, error: null });
        
        const params = {
          category: categoryId,
          limit: 12,
          sortBy: sortBy,
          sortOrder: sortBy === 'name' ? 'asc' : 'desc',
          status: 'published',
          isActive: true
        };
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        return productsApi.getProducts(params)
          .then((response) => {
            if (response.success) {
              const products = response.data.products || [];
              
              // Cache the result
              const cacheData = {
                products,
                timestamp: Date.now()
              };
              
              categoryProductsCache.set(cacheKey, cacheData);
              
              set({ 
                categoryProducts: products, 
                productsLoading: false,
                categoryProductsCache: new Map(categoryProductsCache)
              });
              
              return { success: true, data: products };
            } else {
              set({ 
                categoryProducts: [], 
                productsLoading: false,
                error: response.message || 'Failed to load products' 
              });
              return { success: false, message: response.message };
            }
          })
          .catch((error) => {
            console.error('Error fetching category products:', error);
            set({ 
              categoryProducts: [], 
              productsLoading: false,
              error: 'Failed to load products' 
            });
            return { success: false, message: error.message };
          });
      },

      // Handle category selection
      handleCategoryClick: (category) => {
        set({
          selectedCategory: category,
          currentView: 'products',
          searchTerm: '',
          sortBy: 'createdAt'
        });
        
        // Fetch products for the selected category
        get().fetchCategoryProducts(category._id);
      },

      // Handle search and sort
      handleSearchAndSort: () => {
        const { selectedCategory, searchTerm, sortBy } = get();
        
        if (!selectedCategory) return;
        
        set({ debouncedSearchTerm: searchTerm });
        get().fetchCategoryProducts(selectedCategory._id, searchTerm, sortBy);
      },

      // Handle back to categories
      handleBackToCategories: () => {
        set({
          currentView: 'categories',
          selectedCategory: null,
          categoryProducts: [],
          searchTerm: '',
          sortBy: 'createdAt'
        });
      },

      // Clear cache
      clearCache: () => {
        set({ 
          categoriesCache: null,
          featuredProductsCache: null,
          categoryProductsCache: new Map(),
          lastFetchTime: null 
        });
      },

      // Reset state
      reset: () => {
        set({
          categories: [],
          featuredProducts: [],
          categoryProducts: [],
          loading: false,
          productsLoading: false,
          error: null,
          retrying: false,
          currentView: 'categories',
          selectedCategory: null,
          searchTerm: '',
          sortBy: 'createdAt',
          viewMode: 'grid',
          debouncedSearchTerm: ''
        });
      }
    }),
    {
      name: 'home-store',
    }
  )
);

export default useHomeStore;
