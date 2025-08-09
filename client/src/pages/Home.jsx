import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Download, ArrowRight, CheckCircle, Loader2, ArrowLeft, Search, Grid, List, Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';

// Import components
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import CustomerSatisfaction from '../components/CustomerSatisfaction';
import { categoriesApi, productsApi } from '../services';
import useAuthStore from '../stores/authStore';
import useWishlistStore from '../stores/wishlistStore';
import useCartStore from '../stores/cartStore';
import toast from 'react-hot-toast';
import { createCartImageData } from '../utils/image';
import { useLocalizedProductName } from '../utils/productUtils';

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const { addToWishlist, removeFromWishlist, items: wishlistItems } = useWishlistStore();
  const { addItem } = useCartStore();
  
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);
  
  // New state for categories/products view
  const [currentView, setCurrentView] = useState('categories');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState('grid');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Sample data for the swiper
  const slides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80',
      title: 'Welcome to Simple Decor',
      subtitle: 'Transform your space with elegant designs',
      description: 'Discover our collection of beautiful home decor items that will make your space truly special.'
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80',
      title: 'Premium Quality Furniture',
      subtitle: 'Crafted with care and attention to detail',
      description: 'Our furniture pieces are designed to last, combining style with functionality for your perfect home.'
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2032&q=80',
      title: 'Modern Interior Solutions',
      subtitle: 'Contemporary designs for modern living',
      description: 'From minimalist to luxurious, we offer a wide range of interior solutions to match your style.'
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: 'Expert Design Consultation',
      subtitle: 'Professional guidance for your project',
      description: 'Our team of experts is here to help you create the perfect space that reflects your personality.'
    }
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      setRetrying(false);
      
      // Fetch categories and featured products in parallel
      const [categoriesResponse, featuredResponse] = await Promise.all([
        categoriesApi.getCategories({ active: true, limit: 6 }),
        productsApi.getFeaturedProducts(8)
      ]);

      // Handle categories response
      if (categoriesResponse && categoriesResponse.success && categoriesResponse.data) {
        setCategories(categoriesResponse.data);
      } else if (categoriesResponse && categoriesResponse.categories) {
        setCategories(categoriesResponse.categories);
      } else if (Array.isArray(categoriesResponse)) {
        setCategories(categoriesResponse);
      } else {
        setCategories([]);
      }

      // Handle featured products response
      if (featuredResponse && featuredResponse.success && featuredResponse.data && featuredResponse.data.products) {
        setFeaturedProducts(featuredResponse.data.products);
      } else if (featuredResponse && featuredResponse.products) {
        setFeaturedProducts(featuredResponse.products);
      } else if (Array.isArray(featuredResponse)) {
        setFeaturedProducts(featuredResponse);
      } else {
        setFeaturedProducts([]);
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
      
      // Check if it's a rate limit error
      if (error.message.includes('429') || error.message.includes('Too Many Requests')) {
        setError('Server is busy. Please wait a moment and try again.');
        setRetrying(true);
        
        // Auto-retry after 5 seconds
        setTimeout(() => {
          setRetrying(false);
          fetchData();
        }, 5000);
      } else {
        setError('Failed to load data. Please try again later.');
        setCategories([]);
        setFeaturedProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setCurrentView('products');
    setCategoryProducts([]);
    setProductsLoading(true);
    setSearchTerm('');
    
    try {
      const response = await productsApi.getProducts({
        category: category._id,
        limit: 12,
        sortBy: sortBy,
        sortOrder: sortBy === 'name' ? 'asc' : 'desc'
      });
      
      if (response.success) {
        setCategoryProducts(response.data.products || []);
      } else {
        setCategoryProducts([]);
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
      setCategoryProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Handle search and sort changes
  const handleSearchAndSort = async () => {
    if (!selectedCategory) return;
    
    setProductsLoading(true);
    try {
      const params = {
        category: selectedCategory._id,
        limit: 12,
        sortBy: sortBy,
        sortOrder: sortBy === 'name' ? 'asc' : 'desc'
      };
      
      if (debouncedSearchTerm) {
        params.search = debouncedSearchTerm;
      }
      
      const response = await productsApi.getProducts(params);
      
      if (response.success) {
        setCategoryProducts(response.data.products || []);
      } else {
        setCategoryProducts([]);
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
      setCategoryProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Handle back to categories
  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory(null);
    setCategoryProducts([]);
    setSearchTerm('');
  };

  // Get primary image URL from product
  const getPrimaryImage = (product) => {
    if (product.images && product.images.length > 0) {
      const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
      return primaryImage.url;
    }
    return null;
  };

  // Get localized name
  const getLocalizedName = (product) => {
    const currentLang = localStorage.getItem('i18nextLng') || 'vi';
    return product.name?.[currentLang] || product.name?.vi || product.name?.en || 'Unnamed Product';
  };

  // Get localized description
  const getLocalizedDescription = (product) => {
    const currentLang = localStorage.getItem('i18nextLng') || 'vi';
    return product.description?.[currentLang] || product.description?.vi || product.description?.en || '';
  };

  // Format price
  const formatPrice = (price) => {
    if (!price || !price.amount) return 'Liên hệ';
    
    const amount = price.amount;
    const currency = price.currency || 'VND';
    
    if (currency === 'VND') {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
      }).format(amount);
    }
  };

  // Handlers
  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) {
      // Show toast or alert for login requirement
      return;
    }

    try {
      const isInWishlist = wishlistItems.some(item => item.product._id === productId);
      if (isInWishlist) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    } catch (error) {
      console.error('Error handling wishlist:', error);
    }
  };

  const handleAddToCart = (product) => {
    const imageData = createCartImageData(product);
    const productName = getLocalizedName(product);
    addItem({
      id: product._id,
      name: productName,
      price: {
        amount: product.price?.amount || 0,
        currency: product.price?.currency || 'VND'
      },
      ...imageData,
      quantity: 1
    });
    toast.success(`Đã thêm "${productName}" vào giỏ hàng!`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (selectedCategory) {
      handleSearchAndSort();
    }
  }, [selectedCategory, sortBy, debouncedSearchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-green-600" />
          <p className="text-gray-600">
            {retrying ? 'Server is busy, retrying...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Swiper */}
      <section className="relative h-screen">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          loop={true}
          className="h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${slide.image})`,
                }}
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 flex items-center justify-center h-full">
                <div className="text-center text-white px-4 max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                    {slide.title}
                  </h1>
                  <h2 className="text-xl md:text-2xl font-semibold mb-6 text-gray-200">
                    {slide.subtitle}
                  </h2>
                  <p className="text-lg md:text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/products"
                      className="inline-flex items-center px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300"
                    >
                      Explore Products
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors duration-300"
                    >
                      Get Quote
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>


      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Handpicked products that showcase our commitment to quality and design excellence.
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No featured products available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
                              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Customer Satisfaction Section */}
      <CustomerSatisfaction />
      
    </div>
  );
};

export default Home; 