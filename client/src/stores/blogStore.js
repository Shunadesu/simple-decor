import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import blogApi from '../services/blogApi';

const useBlogStore = create(
  devtools(
    (set, get) => ({
      // State
      posts: [],
      categories: [],
      loading: false,
      error: null,
      
      // Filters & Pagination
      selectedCategory: 'all',
      searchTerm: '',
      currentPage: 1,
      totalPages: 1,
      
      // Cache
      postsCache: new Map(),
      categoriesCache: null,
      lastFetchTime: null,
      cacheExpiry: 5 * 60 * 1000, // 5 minutes

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      setCurrentPage: (page) => set({ currentPage: page }),
      setTotalPages: (pages) => set({ totalPages: pages }),

      // Fetch initial data (categories and posts)
      fetchData: () => {
        const { categoriesCache, lastFetchTime, cacheExpiry } = get();
        
        // Check cache
        if (categoriesCache && lastFetchTime && (Date.now() - lastFetchTime) < cacheExpiry) {
          set({ 
            categories: categoriesCache,
            loading: false 
          });
          return Promise.resolve({ success: true });
        }

        set({ loading: true, error: null });
        
        // Fetch categories and posts in parallel
        return Promise.all([
          blogApi.getCategories(),
          blogApi.getPosts({ status: 'published', limit: 12 })
        ])
        .then(([categoriesResponse, postsResponse]) => {
          let categories = [];
          let posts = [];
          let totalPages = 1;

          if (categoriesResponse.success) {
            const categoriesWithAll = [
              { id: 'all', name: 'Tất cả', count: postsResponse.data?.total || 0 },
              ...categoriesResponse.data.map(cat => ({
                id: cat.id || cat._id,
                name: cat.name,
                count: cat.count || 0
              }))
            ];
            categories = categoriesWithAll;
          }

          if (postsResponse.success) {
            posts = postsResponse.data.posts || [];
            totalPages = postsResponse.data.totalPages || 1;
          }
          
          set({ 
            categories, 
            posts,
            totalPages,
            categoriesCache: categories,
            lastFetchTime: Date.now(),
            loading: false 
          });
          
          return { success: true };
        })
        .catch((error) => {
          console.error('Error fetching blog data:', error);
          set({ 
            error: 'Failed to load blog data',
            loading: false 
          });
          return { success: false, error: error.message };
        });
      },

      // Fetch posts with filters
      fetchPosts: () => {
        const { selectedCategory, searchTerm, currentPage, postsCache, cacheExpiry } = get();
        
        // Create cache key
        const cacheKey = `${selectedCategory}-${searchTerm}-${currentPage}`;
        
        // Check cache
        if (postsCache.has(cacheKey)) {
          const cachedData = postsCache.get(cacheKey);
          if (cachedData.timestamp && (Date.now() - cachedData.timestamp) < cacheExpiry) {
            set({ 
              posts: cachedData.posts,
              totalPages: cachedData.totalPages
            });
            return Promise.resolve({ success: true, data: cachedData.posts });
          }
        }

        const params = {
          status: 'published',
          limit: 12,
          page: currentPage
        };

        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }

        if (searchTerm) {
          params.search = searchTerm;
        }

        return blogApi.getPosts(params)
          .then((response) => {
            if (response.success) {
              const posts = response.data.posts || [];
              const totalPages = response.data.totalPages || 1;
              
              // Cache the result
              const cacheData = {
                posts,
                totalPages,
                timestamp: Date.now()
              };
              
              postsCache.set(cacheKey, cacheData);
              
              set({ 
                posts,
                totalPages,
                postsCache: new Map(postsCache)
              });
              
              return { success: true, data: posts };
            } else {
              set({ error: response.message || 'Failed to load posts' });
              return { success: false, message: response.message };
            }
          })
          .catch((error) => {
            console.error('Error fetching posts:', error);
            set({ error: 'Failed to load posts' });
            return { success: false, message: error.message };
          });
      },

      // Handle category selection
      handleCategoryChange: (category) => {
        set({ selectedCategory: category, currentPage: 1 });
        get().fetchPosts();
      },

      // Handle search
      handleSearch: (term) => {
        set({ searchTerm: term, currentPage: 1 });
        get().fetchPosts();
      },

      // Handle pagination
      handlePageChange: (page) => {
        set({ currentPage: page });
        get().fetchPosts();
      },

      // Clear cache
      clearCache: () => {
        set({ 
          postsCache: new Map(),
          categoriesCache: null,
          lastFetchTime: null 
        });
      },

      // Reset state
      reset: () => {
        set({
          posts: [],
          categories: [],
          loading: false,
          error: null,
          selectedCategory: 'all',
          searchTerm: '',
          currentPage: 1,
          totalPages: 1
        });
      }
    }),
    { name: 'blog-store' }
  )
);

export default useBlogStore;
