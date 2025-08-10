import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

// Import components
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import CustomerSatisfaction from '../components/CustomerSatisfaction';

// Import new Home components
import HeroSwiper from '../components/Home/HeroSwiper';
import HeroImage from '../components/Home/HeroImage';
import FeaturedCategories from '../components/Home/FeaturedCategories';
import ArticlesGrid from '../components/Home/ArticlesGrid';
import WhyChooseUs from '../components/Home/WhyChooseUs';
import InsightsSection from '../components/Home/InsightsSection';
import useAuthStore from '../stores/authStore';
import useWishlistStore from '../stores/wishlistStore';
import useCartStore from '../stores/cartStore';
import useHomeStore from '../stores/homeStore';
import toast from 'react-hot-toast';
import { createCartImageData } from '../utils/image';
import { useLocalizedProductName } from '../utils/productUtils';

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const { addToWishlist, removeFromWishlist, items: wishlistItems } = useWishlistStore();
  const { addItem } = useCartStore();
  
  // Home store
  const {
    categories,
    featuredProducts,
    categoryProducts,
    loading,
    productsLoading,
    error,
    retrying,
    currentView,
    selectedCategory,
    searchTerm,
    sortBy,
    viewMode,
    debouncedSearchTerm,
    setSearchTerm,
    setSortBy,
    setViewMode,
    setDebouncedSearchTerm,
    fetchData,
    handleCategoryClick,
    handleSearchAndSort,
    handleBackToCategories
  } = useHomeStore();

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
    toast.success(t('home.addedToCart', { productName }));
  };

  // Simple useEffect without complex dependencies
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  useEffect(() => {
    if (selectedCategory) {
      handleSearchAndSort();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, sortBy, debouncedSearchTerm]);


  return (
    <div className="min-h-screen">
      {/* Hero Swiper Section */}
      <HeroSwiper />

      {/* Featured Categories Section */}
      <FeaturedCategories />
      {/* Hero Image Section */}
      <HeroImage />

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('home.featuredProducts.title')}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('home.featuredProducts.subtitle')}
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
              <p className="text-gray-600">{t('home.featuredProducts.noProducts')}</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              {t('home.featuredProducts.viewAllProducts')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Articles Grid Section */}
      <ArticlesGrid />

      {/* Insights Section */}
      <InsightsSection />

      {/* Customer Satisfaction Section */}
      <CustomerSatisfaction />
      
    </div>
  );
};

export default Home; 