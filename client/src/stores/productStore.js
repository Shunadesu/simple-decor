import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import productsApi from '../services/productsApi';
import categoriesApi from '../services/categoriesApi';

const useProductStore = create(
  devtools(
    (set, get) => ({
      // State
      products: [],
      categories: [],
      loading: false,
      error: null,
      
      // Pagination
      currentPage: 1,
      totalPages: 0,
      totalProducts: 0,
      itemsPerPage: 12,
      
      // Filters
      selectedCategory: 'all',
      searchTerm: '',
      sortBy: 'createdAt',
      viewMode: 'masonry', // masonry, grid, list, showcase
      
      // View state
      currentView: 'products', // 'categories' or 'products'
      
      // Cache
      productsCache: new Map(),
      categoriesCache: null,
      lastFetchTime: null,
      cacheExpiry: 5 * 60 * 1000, // 5 minutes

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setSortBy: (sort) => set({ sortBy: sort }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setCurrentView: (view) => set({ currentView: view }),
      
      // Reset filters
      resetFilters: () => set({
        selectedCategory: 'all',
        searchTerm: '',
        sortBy: 'createdAt',
        currentPage: 1
      }),

      // Fetch categories
      fetchCategories: async () => {
        const { categoriesCache, lastFetchTime, cacheExpiry } = get();
        
        // Check cache
        if (categoriesCache && lastFetchTime && (Date.now() - lastFetchTime) < cacheExpiry) {
          set({ categories: categoriesCache });
          return { success: true, data: categoriesCache };
        }

        try {
          set({ loading: true, error: null });
          
          const response = await categoriesApi.getCategories();
          
          if (response.success) {
            const categoriesData = response.data || [];
            const allCategories = [
              { _id: 'all', name: { en: 'All', vi: 'Tất cả' }, count: get().totalProducts },
              ...categoriesData.map(category => ({
                ...category,
                count: category.productCount || category.count || 0
              }))
            ];
            
            set({ 
              categories: allCategories, 
              categoriesCache: allCategories,
              lastFetchTime: Date.now()
            });
            
            return { success: true, data: allCategories };
          } else {
            // Fallback categories
            const fallbackCategories = [
              { _id: 'all', name: { en: 'All', vi: 'Tất cả' }, count: get().totalProducts },
              { _id: '1', name: { en: 'Storage Baskets', vi: 'Giỏ đựng đồ' }, count: 0 },
              { _id: '2', name: { en: 'Decorative Items', vi: 'Đồ trang trí' }, count: 0 },
              { _id: '3', name: { en: 'Kitchen Ware', vi: 'Đồ nhà bếp' }, count: 0 }
            ];
            
            set({ categories: fallbackCategories });
            return { success: false, message: response.message, data: fallbackCategories };
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          
          // Fallback categories
          const fallbackCategories = [
            { _id: 'all', name: { en: 'All', vi: 'Tất cả' }, count: get().totalProducts },
            { _id: '1', name: { en: 'Storage Baskets', vi: 'Giỏ đựng đồ' }, count: 0 },
            { _id: '2', name: { en: 'Decorative Items', vi: 'Đồ trang trí' }, count: 0 },
            { _id: '3', name: { en: 'Kitchen Ware', vi: 'Đồ nhà bếp' }, count: 0 }
          ];
          
          set({ 
            categories: fallbackCategories, 
            error: 'Không thể tải danh mục sản phẩm' 
          });
          
          return { success: false, message: 'Không thể tải danh mục sản phẩm', data: fallbackCategories };
        } finally {
          set({ loading: false });
        }
      },

      // Fetch products
      fetchProducts: async () => {
        const { 
          currentPage, 
          selectedCategory, 
          searchTerm, 
          sortBy, 
          itemsPerPage,
          productsCache,
          lastFetchTime,
          cacheExpiry
        } = get();

        // Create cache key
        const cacheKey = `${selectedCategory}-${searchTerm}-${sortBy}-${currentPage}`;
        
        // Check cache
        if (productsCache.has(cacheKey)) {
          const cachedData = productsCache.get(cacheKey);
          if (cachedData.timestamp && (Date.now() - cachedData.timestamp) < cacheExpiry) {
            set({
              products: cachedData.products,
              totalPages: cachedData.totalPages,
              totalProducts: cachedData.totalProducts
            });
            return { success: true, data: cachedData };
          }
        }

        try {
          set({ loading: true, error: null });
          
          // Build query parameters
          const params = {
            page: currentPage,
            limit: itemsPerPage,
            sortBy: sortBy,
            sortOrder: sortBy === 'name' ? 'asc' : 'desc',
            status: 'published',
            isActive: true
          };
          
          if (selectedCategory !== 'all') {
            params.category = selectedCategory;
          }
          
          if (searchTerm) {
            params.search = searchTerm;
          }
          
          console.log('Fetching products with params:', params);
          const response = await productsApi.getProducts(params);
          console.log('Products response:', response);
          
          if (response.success) {
            const productsData = response.data.products || [];
            const totalPages = response.data.totalPages || 0;
            const totalProducts = response.data.total || 0;
            
            // Cache the result
            const cacheData = {
              products: productsData,
              totalPages,
              totalProducts,
              timestamp: Date.now()
            };
            
            productsCache.set(cacheKey, cacheData);
            
            set({
              products: productsData,
              totalPages,
              totalProducts,
              productsCache: new Map(productsCache)
            });
            
            return { success: true, data: response.data };
          } else {
            set({ error: response.message || 'Không thể tải danh sách sản phẩm' });
            return { success: false, message: response.message || 'Không thể tải danh sách sản phẩm' };
          }
        } catch (error) {
          console.error('Error fetching products:', error);
          set({ error: 'Không thể tải danh sách sản phẩm' });
          return { success: false, message: 'Không thể tải danh sách sản phẩm' };
        } finally {
          set({ loading: false });
        }
      },

      // Update categories when totalProducts changes
      updateCategoriesWithTotal: (totalProducts) => {
        const { categories } = get();
        if (categories.length > 0) {
          const updatedCategories = categories.map(category => 
            category._id === 'all' 
              ? { ...category, count: totalProducts }
              : category
          );
          set({ categories: updatedCategories });
        }
      },

      // Clear cache
      clearCache: () => {
        set({ 
          productsCache: new Map(), 
          categoriesCache: null, 
          lastFetchTime: null 
        });
      },

      // Handle category selection
      handleCategoryClick: (categoryId) => {
        set({
          selectedCategory: categoryId,
          currentView: 'products',
          currentPage: 1,
          searchTerm: ''
        });
      },

      // Handle back to categories
      handleBackToCategories: () => {
        set({
          currentView: 'categories',
          selectedCategory: 'all',
          products: [],
          currentPage: 1,
          searchTerm: ''
        });
      },

      // Handle URL search parameters
      handleUrlSearch: (searchParam) => {
        if (searchParam) {
          set({
            searchTerm: searchParam,
            currentView: 'products',
            selectedCategory: 'all',
            currentPage: 1
          });
        }
      }
    }),
    {
      name: 'product-store',
    }
  )
);

export default useProductStore;
