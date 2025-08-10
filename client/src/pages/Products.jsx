import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Search, 
  Filter, 
  Eye, 
  Download, 
  Grid, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Heart, 
  ShoppingCart, 
  ArrowLeft,
  ArrowRight,
  Award,
  Users,
  Globe,
  Leaf,
  Shield,
  Truck,
  Clock,
  CheckCircle,
  TrendingUp,
  Sparkles,
  Package,
  Zap,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  Play,
  Pause,
  Maximize2,
  ZoomIn,
  Tag,
  Clock as ClockIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickViewModal from '../components/QuickViewModal';
import toast from 'react-hot-toast';
import { createCartImageData, getCategoryImageUrl, createCategoryImageData, createImageProps, getOptimizedCloudinaryUrl } from '../utils/image';
import { useLocalizedProductName, useLocalizedCategoryName } from '../utils/productUtils';
import useAuthStore from '../stores/authStore';
import useWishlistStore from '../stores/wishlistStore';
import useCartStore from '../stores/cartStore';
import useProductStore from '../stores/productStore';

const Products = () => {
  const { t, i18n, ready } = useTranslation();
  
  // Debug logging  
  console.log('Products - i18n ready:', ready);
  console.log('Products - Title translation:', t('products.title'));
  
  // Show loading if translations not ready
  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Loading translations...</div>
    </div>;
  }
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { addToWishlist, removeFromWishlist, items: wishlistItems } = useWishlistStore();
  const { addItem } = useCartStore();
  
  // Product store
  const {
    products,
    categories,
    loading,
    error,
    currentPage,
    totalPages,
    totalProducts,
    selectedCategory,
    searchTerm,
    sortBy,
    viewMode,
    currentView,
    setCurrentPage,
    setSelectedCategory,
    setSearchTerm,
    setSortBy,
    setViewMode,
    setCurrentView,
    fetchProducts,
    fetchCategories,
    handleCategoryClick,
    handleBackToCategories,
    handleUrlSearch,
    updateCategoriesWithTotal
  } = useProductStore();
  
  // Selected product for modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // Handle URL search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    handleUrlSearch(searchParam);
  }, [location.search, handleUrlSearch]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products when category is selected or search term changes
  useEffect(() => {
    if (currentView === 'products') {
      fetchProducts();
    }
  }, [currentPage, selectedCategory, searchTerm, sortBy, currentView, fetchProducts]);

  // Update categories when totalProducts changes
  useEffect(() => {
    updateCategoriesWithTotal(totalProducts);
  }, [totalProducts, updateCategoriesWithTotal]);

  // Handle quick view
  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    const imageData = createCartImageData(product);
    const productName = product.name?.vi || product.name?.en || product.name;
    addItem({
      id: product._id,
      name: productName,
      price: {
        amount: product.price?.amount || 0,
        currency: product.price.currency || 'VND'
      },
      ...imageData,
      quantity: 1
    });
    toast.success(`Đã thêm "${productName}" vào giỏ hàng!`);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (product) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm vào danh sách yêu thích');
      return;
    }
    
    const isInWishlist = wishlistItems.some(item => item.product._id === product._id);
    if (isInWishlist) {
      removeFromWishlist(product._id);
      toast.success('Đã xóa khỏi danh sách yêu thích');
    } else {
      addToWishlist(product._id);
      toast.success('Đã thêm vào danh sách yêu thích');
    }
  };

  // Render different product layouts
  const renderProductLayout = () => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse border border-gray-100">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-5">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-3"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t('products.noProducts.title')}
          </h3>
          <p className="text-gray-600 mb-6">
            {t('products.noProducts.description')}
          </p>
          <button
            onClick={handleBackToCategories}
            className="inline-flex items-center px-5 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('products.noProducts.backToCategories')}
          </button>
        </div>
      );
    }

    switch (viewMode) {
      case 'masonry':
        return (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {products.map((product, index) => (
              <div key={product._id} className="break-inside-avoid mb-6">
                <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                  {/* Product Image with Overlay */}
                  <div className="relative overflow-hidden">
                    <img 
                      src={product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || '/placeholder-product.svg'} 
                      alt={product.name?.vi || product.name?.en || product.name || 'Product'}
                      className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.svg';
                      }}
                    />
                    
                    {/* Overlay with Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <div className="flex space-x-3">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleQuickView(product);
                          }}
                          className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
                          title="Quick View"
                        >
                          <Eye className="w-5 h-5 text-gray-700" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleWishlistToggle(product);
                          }}
                          className={`bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors ${
                            wishlistItems.some(item => item.product._id === product._id) ? 'text-red-500' : 'text-gray-700'
                          }`}
                          title={
                            !isAuthenticated 
                              ? 'Đăng nhập để thêm vào danh sách yêu thích' 
                              : wishlistItems.some(item => item.product._id === product._id)
                                ? 'Xóa khỏi danh sách yêu thích' 
                                : 'Thêm vào danh sách yêu thích'
                          }
                        >
                          <Heart className={`w-5 h-5 ${wishlistItems.some(item => item.product._id === product._id) ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className="bg-primary-600 p-3 rounded-full hover:bg-primary-700 transition-colors"
                          title="Add to Cart"
                        >
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4">
                      {product.isNew && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          New
                        </span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      {product.discount && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary-600 transition-colors line-clamp-1">
                        {product.name?.vi || product.name?.en || product.name || 'Product'}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(product.reviewStats?.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {product.description?.vi || product.description?.en || product.description || ''}
                    </p>

                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-gray-500">
                      <div className="flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        <span>{product.material || 'N/A'}</span>
                      </div>
                      <div className="flex items-center">
                        <Maximize2 className="w-3 h-3 mr-1" />
                        <span>{product.formattedDimensions || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">
                          {product.price?.amount ? 
                            new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: product.price.currency || 'VND'
                            }).format(product.price.amount) : t('products.price.contact')
                          }
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-400 line-through ml-2">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: product.price.currency || 'VND'
                            }).format(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                        {t('products.addToCart')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'showcase':
        return (
          <div className="space-y-8">
            {products.map((product, index) => (
              <div key={product._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  {/* Image Section */}
                  <div className="relative h-80 lg:h-full overflow-hidden">
                    <img 
                      src={product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || '/placeholder-product.svg'} 
                      alt={product.name?.vi || product.name?.en || product.name || 'Product'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.svg';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    
                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex space-x-2">
                      {product.isNew && (
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          New
                        </span>
                      )}
                      {product.discount && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="mb-4">
                      <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        {product.name?.vi || product.name?.en || product.name || 'Product'}
                      </h2>
                      <p className="text-gray-600 text-lg leading-relaxed mb-4">
                        {product.description?.vi || product.description?.en || product.description || ''}
                      </p>
                    </div>

                    {/* Product Specs */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Tag className="w-4 h-4 text-primary-600 mr-2" />
                          <span className="font-medium text-gray-900">Material</span>
                        </div>
                        <span className="text-gray-600">{product.material || 'N/A'}</span>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <Maximize2 className="w-4 h-4 text-primary-600 mr-2" />
                          <span className="font-medium text-gray-900">Dimensions</span>
                        </div>
                        <span className="text-gray-600">{product.formattedDimensions || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center mb-6">
                      <div className="flex items-center mr-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            className={i < Math.floor(product.reviewStats?.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                        <span className="ml-2 text-gray-600">({product.reviewStats?.totalReviews || 0} reviews)</span>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-primary-600">
                          {product.price?.amount ? 
                            new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: product.price.currency || 'VND'
                            }).format(product.price.amount) : t('products.price.contact')
                          }
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-400 line-through ml-3">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: product.price.currency || 'VND'
                            }).format(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-3">
                        <button 
                          onClick={() => handleWishlistToggle(product)}
                          className={`p-3 rounded-lg transition-colors ${
                            wishlistItems.some(item => item.product._id === product._id)
                              ? 'bg-red-500 text-white hover:bg-red-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          title={
                            !isAuthenticated 
                              ? 'Đăng nhập để thêm vào danh sách yêu thích' 
                              : wishlistItems.some(item => item.product._id === product._id)
                                ? 'Xóa khỏi danh sách yêu thích' 
                                : 'Thêm vào danh sách yêu thích'
                          }
                        >
                          <Heart className={`w-5 h-5 ${wishlistItems.some(item => item.product._id === product._id) ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={() => handleQuickView(product)}
                          className="bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors"
                          title="Quick View"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleAddToCart(product)}
                          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                        >
                          {t('products.addToCart')}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'grid':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        );

      case 'list':
        return (
          <div className="space-y-4">
            {products.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`} className="block">
                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                  <div className="flex items-center space-x-6">
                    <img 
                      src={product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || '/placeholder-product.svg'} 
                      alt={product.name?.vi || product.name?.en || product.name || 'Product'}
                      className="w-24 h-24 object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        e.target.src = '/placeholder-product.svg';
                      }}
                    />
                  
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg mb-2">
                            {product.name?.vi || product.name?.en || product.name || 'Product'}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {product.description?.vi || product.description?.en || product.description || ''}
                          </p>
                          
                          <div className="grid grid-cols-3 gap-3 text-xs text-gray-500">
                            <div>
                              <span className="font-medium">{t('products.details.material')}:</span> {product.material || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">{t('products.details.dimensions')}:</span> {product.formattedDimensions || 'N/A'}
                            </div>
                            <div>
                              <span className="font-medium">{t('products.details.moisture')}:</span> {product.moisture || 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right ml-4">
                          <span className="text-xl font-bold text-primary-600">
                            {product.price?.amount ? 
                              new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: product.price.currency || 'VND'
                              }).format(product.price.amount) : t('products.price.contact')
                            }
                          </span>
                          <div className="flex items-center justify-end mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < Math.floor(product.reviewStats?.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                              />
                            ))}
                            <span className="text-xs text-gray-500 ml-1">
                              ({product.reviewStats?.totalReviews || 0})
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 mt-4">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleQuickView(product);
                          }}
                          className="bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2 text-sm"
                        >
                          <Eye size={16} />
                          <span>{t('products.viewDetails')}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={!product.stock?.isAvailable || product.stock?.quantity <= 0}
                          className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 text-sm"
                        >
                          <ShoppingCart size={16} />
                          <span>{t('products.addToCart')}</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleWishlistToggle(product);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            wishlistItems.some(item => item.product._id === product._id)
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                          }`}
                        >
                          <Heart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        );

      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Hero Section - Focus on Products */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20 mt-32 ">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              {t('products.title')}
            </h1>
            <p className="text-xl text-primary-100 max-w-2xl mx-auto">
              {t('products.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap justify-center items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2 text-primary-600" />
              <span>10,000+ {t('products.stats.customers')}</span>
            </div>
            <div className="flex items-center">
              <Globe className="w-4 h-4 mr-2 text-primary-600" />
              <span>50+ {t('products.stats.countries')}</span>
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2 text-primary-600" />
              <span>98% {t('products.stats.satisfaction')}</span>
            </div>
            <div className="flex items-center">
              <Leaf className="w-4 h-4 mr-2 text-primary-600" />
              <span>100% {t('products.stats.natural')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Showcase - Enhanced for Product Focus */}
      {currentView === 'categories' && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {t('products.categories.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('products.categories.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  className="group bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  {/* Category Image */}
                  <div className="h-48 relative overflow-hidden">
                    {(() => {
                      const categoryImageData = createCategoryImageData(category);
                      const optimizedImageUrl = getOptimizedCloudinaryUrl(categoryImageData.url, {
                        width: 400,
                        height: 300,
                        crop: 'fill',
                        quality: 'auto'
                      });
                      
                      return (
                        <>
                          {categoryImageData.hasImage ? (
                            <img
                              {...createImageProps(
                                optimizedImageUrl,
                                categoryImageData.alt,
                                '/placeholder-product.svg'
                              )}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="h-full bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                                  <span className="text-white font-bold text-xl">
                                    {categoryImageData.alt.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="text-primary-600 font-medium">
                                  {category.count || 0} {t('products.categories.products')}
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                    
                    {/* Product Count Badge */}
                    <div className="absolute top-3 right-3">
                      <span className="bg-white/90 backdrop-blur-sm text-primary-600 px-2 py-1 rounded-full text-xs font-medium">
                        {category.count || 0} {t('products.categories.products')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-primary-600 transition-colors">
                      {category.name?.vi || category.name?.en || category.name || 'Unknown'}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {category.description?.[localStorage.getItem('i18nextLng') || 'vi'] || category.description?.vi || category.description?.en || t('products.categories.fallbackDescription')}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-primary-600 text-sm font-medium">
                        {t('products.categories.viewProducts')}
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Products Button */}
            <div className="mt-10 text-center">
              <button
                onClick={() => handleCategoryClick('all')}
                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Grid className="w-4 h-4 mr-2" />
                <span>{t('products.categories.viewAllProducts')}</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Products Section - Enhanced Product Focus */}
      {currentView === 'products' && (
        <section id="products" className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {/* Back button */}
            <div className="mb-6">
              <button
                onClick={handleBackToCategories}
                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                <ArrowLeft size={18} />
                <span>{t('products.backToCategories')}</span>
              </button>
            </div>

            {/* Enhanced Product Filters - More Prominent */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder={t('products.search.placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>



                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="createdAt">{t('products.sort.newest')}</option>
                  <option value="name">{t('products.sort.name')}</option>
                  <option value="price.amount">{t('products.sort.priceLow')}</option>
                  <option value="reviewStats.averageRating">{t('products.sort.rating')}</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('masonry')}
                    className={`px-4 py-3 ${viewMode === 'masonry' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    title="Masonry Layout"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('showcase')}
                    className={`px-4 py-3 ${viewMode === 'showcase' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    title="Showcase Layout"
                  >
                    <Maximize2 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-3 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    title="Grid Layout"
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-3 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                    title="List Layout"
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-center lg:justify-end">
                  <p className="text-gray-600 font-medium">
                    {t('products.showing', { 
                      count: products.length, 
                      total: totalProducts 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Products Layout */}
            {renderProductLayout()}

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2 bg-white rounded-xl shadow-md p-2 border border-gray-100">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    const isActive = page === currentPage;
                    const isNearActive = Math.abs(page - currentPage) <= 2;
                    
                    if (isActive || isNearActive || page === 1 || page === totalPages) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg border font-medium transition-colors ${
                            isActive
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === 2 && currentPage > 4) {
                      return <span key={page} className="px-2">...</span>;
                    } else if (page === totalPages - 1 && currentPage < totalPages - 3) {
                      return <span key={page} className="px-2">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        product={selectedProduct}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </div>
  );
};

export default Products; 