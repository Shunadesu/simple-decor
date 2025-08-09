import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Eye, Download, Grid, List, ChevronLeft, ChevronRight, Star, Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Toast from '../components/Toast';
import toast from 'react-hot-toast';
import { createCartImageData, getCategoryImageUrl, createCategoryImageData, createImageProps, getOptimizedCloudinaryUrl } from '../utils/image';
import { useLocalizedProductName, useLocalizedCategoryName } from '../utils/productUtils';
import useAuthStore from '../stores/authStore';
import useWishlistStore from '../stores/wishlistStore';
import useCartStore from '../stores/cartStore';
import productsApi from '../services/productsApi';
import categoriesApi from '../services/categoriesApi';

const Products = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAuthenticated } = useAuthStore();
  const { addToWishlist, removeFromWishlist, items: wishlistItems } = useWishlistStore();
  const { addItem } = useCartStore();
  
  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Filter state
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  
  // View state - 'categories' or 'products'
  const [currentView, setCurrentView] = useState('products');
  
  // Selected product for modal
  const [selectedProduct, setSelectedProduct] = useState(null);

    // Handle URL search parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchParam = urlParams.get('search');
    
    if (searchParam) {
      setSearchTerm(searchParam);
      setCurrentView('products');
      setSelectedCategory('all');
    }
  }, [location.search]);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
}, []);

  // Fetch products when category is selected or search term changes
  useEffect(() => {
    if (currentView === 'products') {
      fetchProducts();
    }
  }, [currentPage, selectedCategory, searchTerm, sortBy, currentView]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
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
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalProducts(response.data.total || 0);
      } else {
        setError(response.message || 'Không thể tải danh sách sản phẩm');
        showToast(response.message || 'Không thể tải danh sách sản phẩm', 'error');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Không thể tải danh sách sản phẩm');
      showToast('Không thể tải danh sách sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoriesApi.getCategories();
      console.log('Categories response:', response);
      
      if (response.success) {
        const categoriesData = response.data || [];
        console.log('Categories data:', categoriesData);
        
        // Add "All" category with total products count
        const allCategories = [
          { _id: 'all', name: { en: 'All', vi: 'Tất cả' }, count: totalProducts },
          ...categoriesData.map(category => ({
            ...category,
            count: category.productCount || category.count || 0
          }))
        ];
        console.log('All categories:', allCategories);
        setCategories(allCategories);
      } else {
        console.error('Error fetching categories:', response.message);
        // Fallback categories
        const fallbackCategories = [
          { _id: 'all', name: { en: 'All', vi: 'Tất cả' }, count: totalProducts },
          { _id: '1', name: { en: 'Storage Baskets', vi: 'Giỏ đựng đồ' }, count: 0 },
          { _id: '2', name: { en: 'Decorative Items', vi: 'Đồ trang trí' }, count: 0 },
          { _id: '3', name: { en: 'Kitchen Ware', vi: 'Đồ nhà bếp' }, count: 0 }
        ];
        setCategories(fallbackCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback categories khi có lỗi
      const fallbackCategories = [
        { _id: 'all', name: { en: 'All', vi: 'Tất cả' }, count: totalProducts },
        { _id: '1', name: { en: 'Storage Baskets', vi: 'Giỏ đựng đồ' }, count: 0 },
        { _id: '2', name: { en: 'Decorative Items', vi: 'Đồ trang trí' }, count: 0 },
        { _id: '3', name: { en: 'Kitchen Ware', vi: 'Đồ nhà bếp' }, count: 0 }
      ];
      setCategories(fallbackCategories);
    } finally {
      setLoading(false);
    }
  };

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentView('products');
    setCurrentPage(1);
    setSearchTerm('');
  };

  // Handle back to categories
  const handleBackToCategories = () => {
    setCurrentView('categories');
    setSelectedCategory('all');
    setProducts([]);
    setCurrentPage(1);
    setSearchTerm('');
  };

  // Update categories when totalProducts changes
  useEffect(() => {
    if (categories.length > 0) {
      setCategories(prevCategories => 
        prevCategories.map(category => 
          category._id === 'all' 
            ? { ...category, count: totalProducts }
            : category
        )
      );
    }
  }, [totalProducts]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
              <section className="bg-primary-50 text-primary-600 py-20 mt-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('products.title')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Khám phá bộ sưu tập sản phẩm từ vật liệu tự nhiên của chúng tôi
          </p>
        </div>
      </section>

      <div className="container-custom py-12">
        {/* Back button when viewing products */}
        {currentView === 'products' && (
          <div className="mb-6">
            <button
              onClick={handleBackToCategories}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowLeft size={20} />
              <span>Quay lại danh mục</span>
            </button>
          </div>
        )}

        {/* Categories Grid View */}
        {currentView === 'categories' ? (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
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
                              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                            />
                          ) : (
                            <div className="h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                              <div className="text-center">
                                <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                  <span className="text-white font-bold text-xl">
                                    {categoryImageData.alt.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <span className="text-primary-600 font-medium">
                                  {category.count || 0} sản phẩm
                                </span>
                              </div>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {category.name?.vi || category.name?.en || category.name || 'Unknown'}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {category.description?.[localStorage.getItem('i18nextLng') || 'vi'] || category.description?.vi || category.description?.en || 'Khám phá bộ sưu tập sản phẩm đa dạng'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {category.count || 0} sản phẩm
                      </span>
                      <div className="text-primary-600 hover:text-primary-700 transition-colors">
                        <ArrowLeft className="w-4 h-4 transform rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* View All Products Button */}
            <div className="mt-8 text-center">
              <button
                onClick={() => handleCategoryClick('all')}
                className="bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-300 font-medium inline-flex items-center space-x-2"
              >
                <Grid className="w-5 h-5" />
                <span>Xem tất cả sản phẩm</span>
              </button>
            </div>
          </div>
        ) : (
          /* Products View */
          <div>
            {/* Filters and Search */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="createdAt">Mới nhất</option>
                  <option value="name">Tên A-Z</option>
                  <option value="price.amount">Giá thấp đến cao</option>
                  <option value="reviewStats.averageRating">Đánh giá cao nhất</option>
                </select>

                {/* View Mode */}
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600'}`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                {t('products.showing', { 
                  count: products.length, 
                  total: totalProducts 
                })}
              </p>
            </div>

            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <Link key={product._id} to={`/products/${product._id}`} className="block">
                    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center space-x-6">
                        <img 
                          src={product.images?.find(img => img.isPrimary)?.url || product.images?.[0]?.url || '/placeholder-product.svg'} 
                          alt={product.name?.vi || product.name?.en || product.name || 'Product'}
                          className="w-24 h-24 object-cover rounded-lg"
                                          onError={(e) => {
                  e.target.src = '/placeholder-product.svg';
                }}
                        />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-2">
                              {product.name?.vi || product.name?.en || product.name || 'Product'}
                            </h3>
                            <p className="text-gray-600 text-sm mb-3">
                              {product.description?.vi || product.description?.en || product.description || ''}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Chất liệu: {product.material || 'N/A'}</span>
                              <span>Kích thước: {product.formattedDimensions || 'N/A'}</span>
                              <span>Độ ẩm: {product.moisture || 'N/A'}</span>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-lg font-bold text-green-600">
                              {product.price?.amount ? 
                                new Intl.NumberFormat('vi-VN', {
                                  style: 'currency',
                                  currency: product.price.currency || 'VND'
                                }).format(product.price.amount) : 'Liên hệ'
                              }
                            </span>
                            <div className="flex items-center mt-2">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={i < Math.floor(product.reviewStats?.averageRating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                                />
                              ))}
                              <span className="text-sm text-gray-500 ml-2">
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
                              // Navigate to product detail - already handled by parent Link
                            }}
                            className="bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                          >
                            <Eye size={16} />
                            <span>{t('products.viewDetails')}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              const imageData = createCartImageData(product);
                              const productName = product.name?.vi || product.name?.en || product.name;
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
                            }}
                            disabled={!product.stock?.isAvailable || product.stock?.quantity <= 0}
                            className="bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                          >
                            <ShoppingCart size={16} />
                            <span>{t('products.addToCart')}</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              // Check authentication
                              if (!isAuthenticated) {
                                toast.error('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
                                return;
                              }
                              
                              const isInWishlist = wishlistItems.some(item => item.product._id === product._id);
                              if (isInWishlist) {
                                removeFromWishlist(product._id);
                              } else {
                                addToWishlist(product._id);
                              }
                            }}
                            className={`p-2 rounded-lg ${
                              wishlistItems.some(item => item.product._id === product._id)
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                            } transition-colors`}
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
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft size={20} />
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
                          className={`px-3 py-2 rounded-lg border ${
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
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </div>
  );
};

export default Products; 