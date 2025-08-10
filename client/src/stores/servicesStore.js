import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import servicesApi from '../services/servicesApi';

const useServicesStore = create(
  devtools(
    (set, get) => ({
      // State
      services: [],
      featuredServices: [],
      categories: [],
      loading: false,
      error: null,
      
      // Filters
      selectedCategory: 'all',
      searchTerm: '',
      
      // UI State
      isConsultationModalOpen: false,
      selectedService: null,
      
      // Cache
      servicesCache: new Map(),
      featuredServicesCache: null,
      categoriesCache: null,
      lastFetchTime: null,
      cacheExpiry: 5 * 60 * 1000, // 5 minutes

      // Actions
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      setSelectedCategory: (category) => set({ selectedCategory: category }),
      setSearchTerm: (term) => set({ searchTerm: term }),
      
      setIsConsultationModalOpen: (isOpen) => set({ isConsultationModalOpen: isOpen }),
      setSelectedService: (service) => set({ selectedService: service }),

      // Fetch initial data (categories, featured services, and all services)
      fetchData: () => {
        const { categoriesCache, featuredServicesCache, lastFetchTime, cacheExpiry } = get();
        
        // Check cache
        if (categoriesCache && featuredServicesCache && lastFetchTime && (Date.now() - lastFetchTime) < cacheExpiry) {
          set({ 
            categories: categoriesCache, 
            featuredServices: featuredServicesCache,
            loading: false 
          });
          return Promise.resolve({ success: true });
        }

        set({ loading: true, error: null });
        
        // Fetch categories, featured services, and all services
        return Promise.all([
          servicesApi.getServiceCategories(),
          servicesApi.getFeaturedServices(6),
          servicesApi.getServices({ status: 'active', limit: 50 })
        ])
        .then(([categoriesResponse, featuredResponse, servicesResponse]) => {
          let categories = [];
          let featuredServices = [];
          let services = [];

          if (categoriesResponse.success) {
            categories = categoriesResponse.data;
          }

          if (featuredResponse.success) {
            featuredServices = featuredResponse.data;
          }

          if (servicesResponse.success) {
            services = servicesResponse.data.services;
          }
          
          set({ 
            categories, 
            featuredServices,
            services,
            categoriesCache: categories,
            featuredServicesCache: featuredServices,
            lastFetchTime: Date.now(),
            loading: false 
          });
          
          return { success: true };
        })
        .catch((error) => {
          console.error('Error fetching services data:', error);
          set({ 
            error: 'Failed to load services data',
            loading: false 
          });
          return { success: false, error: error.message };
        });
      },

      // Fetch services with filters
      fetchServices: () => {
        const { selectedCategory, searchTerm, servicesCache, cacheExpiry } = get();
        
        // Create cache key
        const cacheKey = `${selectedCategory}-${searchTerm}`;
        
        // Check cache
        if (servicesCache.has(cacheKey)) {
          const cachedData = servicesCache.get(cacheKey);
          if (cachedData.timestamp && (Date.now() - cachedData.timestamp) < cacheExpiry) {
            set({ services: cachedData.services });
            return Promise.resolve({ success: true, data: cachedData.services });
          }
        }

        const params = {
          status: 'active',
          limit: 50
        };

        if (selectedCategory !== 'all') {
          params.category = selectedCategory;
        }

        if (searchTerm) {
          params.search = searchTerm;
        }

        return servicesApi.getServices(params)
          .then((response) => {
            if (response.success) {
              const services = response.data.services;
              
              // Cache the result
              const cacheData = {
                services,
                timestamp: Date.now()
              };
              
              servicesCache.set(cacheKey, cacheData);
              
              set({ 
                services,
                servicesCache: new Map(servicesCache)
              });
              
              return { success: true, data: services };
            } else {
              set({ error: response.message || 'Failed to load services' });
              return { success: false, message: response.message };
            }
          })
          .catch((error) => {
            console.error('Error fetching services:', error);
            set({ error: 'Failed to load services' });
            return { success: false, message: error.message };
          });
      },

      // Handle category selection
      handleCategoryChange: (category) => {
        set({ selectedCategory: category });
        get().fetchServices();
      },

      // Handle search
      handleSearch: (term) => {
        set({ searchTerm: term });
        get().fetchServices();
      },

      // Handle service inquiry
      handleInquiry: (service, currentLanguage) => {
        const selectedService = {
          id: service._id,
          name: servicesApi.getLocalizedTitle(service, currentLanguage)
        };
        set({ 
          selectedService,
          isConsultationModalOpen: true 
        });
      },

      // Close consultation modal
      closeConsultationModal: () => {
        set({ 
          isConsultationModalOpen: false,
          selectedService: null 
        });
      },

      // Clear cache
      clearCache: () => {
        set({ 
          servicesCache: new Map(),
          featuredServicesCache: null,
          categoriesCache: null,
          lastFetchTime: null 
        });
      },

      // Reset state
      reset: () => {
        set({
          services: [],
          featuredServices: [],
          categories: [],
          loading: false,
          error: null,
          selectedCategory: 'all',
          searchTerm: '',
          isConsultationModalOpen: false,
          selectedService: null
        });
      }
    }),
    {
      name: 'services-store',
    }
  )
);

export default useServicesStore;
