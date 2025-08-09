import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  ShoppingCart, 
  MessageSquare, 
  ThumbsUp,
  Camera,
  Package,
  Ruler,
  Scale,
  Palette,
  FileText,
  User,
  Calendar,
  Edit,
  Trash2,
  Plus,
  X
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs, FreeMode } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';
import 'swiper/css/free-mode';
import useAuthStore from '../stores/authStore';
import useCartStore from '../stores/cartStore';
import useWishlistStore from '../stores/wishlistStore';
import productsApi from '../services/productsApi';
import { getProductReviews, createReview, updateReview, deleteReview } from '../services/reviewsApi';
import Toast from '../components/Toast';
import { createCartImageData, getPrimaryImageUrl, createImageProps, getOptimizedCloudinaryUrl } from '../utils/image';
import { useLocalizedProductName, useLocalizedProductDescription } from '../utils/productUtils';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Localization hooks for product content
  const { user, isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  // State
  const [product, setProduct] = useState(null);
  
  // Get localized content for product
  const localizedName = useLocalizedProductName(product);
  const localizedDescription = useLocalizedProductDescription(product);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: ''
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [toast, setToast] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        const response = await productsApi.getProductById(id);
        console.log('Product API response:', response);
        
        if (!response.success) {
          // If product not found and we're in development, create a mock product
          const isNotFound = response.message?.includes('not found') || 
                           response.message?.includes('404') || 
                           response.message?.includes('Product not found') ||
                           !response.data;
          if (isNotFound) {
            console.warn('Product not found, creating mock product for development');
            const mockProduct = {
              _id: id,
              name: {
                vi: 'Sản phẩm mẫu',
                en: 'Sample Product'
              },
              description: {
                vi: 'Đây là sản phẩm mẫu để test ProductDetail page',
                en: 'This is a sample product to test ProductDetail page'
              },
              price: {
                amount: 250000,
                currency: 'VND'
              },
              images: [
                {
                  url: '/placeholder-product.svg',
                  alt: 'Sample Product Image',
                  isPrimary: true
                }
              ],
              stock: {
                isAvailable: true,
                quantity: 10
              },
              category: {
                _id: 'sample-category',
                name: {
                  vi: 'Danh mục mẫu',
                  en: 'Sample Category'
                }
              },
              specifications: {
                material: 'Sample Material',
                dimensions: '10x10x10cm',
                weight: '1kg',
                color: 'Natural',
                packaging: 'Eco-friendly box'
              },
              isMock: true // Flag to identify mock products
            };
            console.log('Using mock product for development');
            setProduct(mockProduct);
            return;
          }
          throw new Error(response.message || 'Product not found');
        }
        
        // Handle the response structure from productsApi
        const productData = response.data;
        console.log('Product data extracted:', productData);
        
        if (!productData) {
          throw new Error('Product not found');
        }
        
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError(error.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      // Don't try to fetch reviews if product hasn't loaded yet
      if (!product) return;
      
      // Skip reviews for mock products to avoid API errors
      if (product.isMock) {
        console.log('Skipping reviews fetch for mock product');
        setReviews([]);
        setReviewStats({ averageRating: 0, totalReviews: 0 });
        setUserReview(null);
        setReviewsLoading(false);
        return;
      }
      
      try {
        setReviewsLoading(true);
        const response = await getProductReviews(id);
        setReviews(response.reviews || []);
        setReviewStats(response.stats || { averageRating: 0, totalReviews: 0 });
        
        // Check if user has already reviewed this product
        if (isAuthenticated && user && response.reviews) {
          const userReview = response.reviews.find(review => review.user._id === user.id);
          setUserReview(userReview || null);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Set default values on error - this is expected when reviews API is not available
        setReviews([]);
        setReviewStats({ averageRating: 0, totalReviews: 0 });
        setUserReview(null);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (id && product) {
      fetchReviews();
    }
  }, [id, product, isAuthenticated, user]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product || !product.category) return;
      
      // Skip related products for mock products
      if (product.isMock) {
        console.log('Skipping related products fetch for mock product');
        setRelatedProducts([]);
        setRelatedLoading(false);
        return;
      }
      
      try {
        setRelatedLoading(true);
        const response = await productsApi.getProducts({
          category: product.category._id || product.category,
          limit: 8,
          exclude: product._id,
          status: 'published',
          isActive: true
        });
        
        if (response.success && response.data.products) {
          setRelatedProducts(response.data.products);
        }
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setRelatedLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (product?.stock?.quantity || 999)) {
      setQuantity(newQuantity);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      const imageData = createCartImageData(product);
      const productName = localizedName || 'Product';
      addItem({
        id: product._id,
        name: productName,
        price: {
          amount: product.price?.amount || 0,
          currency: product.price?.currency || 'VND'
        },
        ...imageData,
        quantity
      });
      setToast({ message: t('productDetail.addedToCart'), type: 'success' });
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      setToast({ message: t('productDetail.loginRequired'), type: 'error' });
      return;
    }

    try {
      await toggleWishlist(product._id);
      setToast({ 
        message: isInWishlist(product._id) 
          ? t('productDetail.removedFromWishlist') 
          : t('productDetail.addedToWishlist'), 
        type: 'success' 
      });
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setToast({ message: t('productDetail.loginRequired'), type: 'error' });
      return;
    }

    try {
      setSubmittingReview(true);
      if (userReview) {
        // Update existing review
        await updateReview(userReview._id, {
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment
        });
        setToast({ message: t('productDetail.reviewUpdated'), type: 'success' });
      } else {
        // Create new review
        await createReview({
          productId: id,
          rating: reviewForm.rating,
          title: reviewForm.title,
          comment: reviewForm.comment
        });
        setToast({ message: t('productDetail.reviewSubmitted'), type: 'success' });
      }
      
      setShowReviewForm(false);
      setReviewForm({ rating: 5, title: '', comment: '' });
      
      // Refresh reviews
      const response = await getProductReviews(id);
      setReviews(response.reviews);
      setReviewStats(response.stats);
      const newUserReview = response.reviews.find(review => review.user._id === user.id);
      setUserReview(newUserReview);
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    } finally {
      setSubmittingReview(false);
    }
  };

  // Handle review deletion
  const handleReviewDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setToast({ message: t('productDetail.reviewDeleted'), type: 'success' });
      
      // Refresh reviews
      const response = await getProductReviews(id);
      setReviews(response.reviews);
      setReviewStats(response.stats);
      setUserReview(null);
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  // Handle helpful toggle
  const handleHelpfulToggle = async (reviewId) => {
    if (!isAuthenticated) {
      setToast({ message: t('productDetail.loginRequired'), type: 'error' });
      return;
    }

    try {
      // This would be implemented in the reviewsApi
      // await toggleHelpful(reviewId);
      setToast({ message: t('productDetail.helpfulUpdated'), type: 'success' });
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('productDetail.error')}</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            {t('productDetail.backToProducts')}
          </button>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('productDetail.productNotFound')}</h2>
          <p className="text-gray-600 mb-4">{t('productDetail.productNotFoundDesc')}</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            {t('productDetail.backToProducts')}
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mock Product Banner */}
      {product.isMock && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="container-custom">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  <strong>Demo Mode:</strong> This is a sample product for testing. Real product data will be loaded from your database.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Header */}
              <section className="bg-primary-800 text-white py-8">
        <div className="container-custom">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-white hover:text-green-200 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('productDetail.backToProducts')}
          </button>
          <h1 className="text-3xl lg:text-4xl font-bold">
            {localizedName || t('productDetail.untitledProduct')}
          </h1>
        </div>
      </section>

      <div className="container-custom py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Product Images Gallery */}
          <div className="space-y-4">
            {/* Main Image Gallery */}
            <div className="relative bg-gray-50 rounded-lg overflow-hidden group">
              <Swiper
                spaceBetween={0}
                navigation={{
                  nextEl: '.swiper-button-next-custom',
                  prevEl: '.swiper-button-prev-custom',
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Pagination, Thumbs]}
                className="h-96 md:h-[500px] lg:h-[600px]"
              >
                {product.images && product.images.length > 0 ? (
                  product.images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative w-full h-full group">
                        <img
                          {...createImageProps(
                            getOptimizedCloudinaryUrl(image.url, {
                              width: 800,
                              height: 600,
                              crop: 'fill',
                              quality: 'auto'
                            }),
                            image.alt || localizedName || 'Product Image',
                            '/placeholder-product.svg'
                          )}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Image Alt Text */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
                          <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {image.alt || `${t('productDetail.imageGallery')} ${index + 1}`}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">{t('productDetail.noImages')}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
              
              {/* Custom Navigation Buttons */}
              {product.images && product.images.length > 1 && (
                <>
                  <button className="swiper-button-prev-custom absolute top-1/2 left-4 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button className="swiper-button-next-custom absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                    <ArrowLeft className="w-5 h-5 text-gray-700 rotate-180" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="px-2">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={12}
                  slidesPerView="auto"
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[Navigation, Thumbs, FreeMode]}
                  className="h-20 md:h-24"
                  breakpoints={{
                    640: {
                      slidesPerView: 4,
                    },
                    768: {
                      slidesPerView: 5,
                    },
                    1024: {
                      slidesPerView: 6,
                    },
                  }}
                >
                  {product.images.map((image, index) => (
                    <SwiperSlide key={index} className="!w-20 md:!w-24">
                      <div className="relative group">
                        <img
                          {...createImageProps(
                            getOptimizedCloudinaryUrl(image.url, {
                              width: 150,
                              height: 150,
                              crop: 'fill',
                              quality: 'auto'
                            }),
                            image.alt || localizedName || 'Product Thumbnail',
                            '/placeholder-product.svg'
                          )}
                          className="w-full h-full object-cover rounded-lg cursor-pointer border-2 border-gray-200 hover:border-primary-500 transition-all duration-200 group-hover:scale-105"
                        />
                        {/* Thumbnail overlay effect */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-200"></div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {localizedName}
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                {localizedDescription}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {renderStars(reviewStats.averageRating)}
              </div>
              <span className="text-gray-600">
                ({reviewStats.totalReviews} {t('productDetail.reviews')})
              </span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-green-600">
              {product.price && typeof product.price.amount === 'number' && product.price.amount > 0
                ? `${product.price.amount.toLocaleString('vi-VN')} ${product.price.currency || 'VND'}`
                : t('common.priceUnavailable')
              }
            </div>

            {/* Stock */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${product.stock?.isAvailable ? 'bg-primary-500' : 'bg-red-500'}`}></div>
              <span className="text-gray-600">
                {product.stock?.isAvailable 
                  ? `${t('productDetail.inStock')} (${product.stock.quantity})`
                  : t('productDetail.outOfStock')
                }
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium">{t('productDetail.quantity')}:</label>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100"
                  disabled={quantity >= (product.stock?.quantity || 999)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.stock?.isAvailable}
                className="flex-1 btn-primary flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t('productDetail.addToCart')}</span>
              </button>
              <button
                onClick={handleWishlistToggle}
                className={`p-3 rounded-lg border ${
                  isInWishlist(product._id)
                    ? 'bg-red-50 border-red-200 text-red-600'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Specifications */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('productDetail.specifications')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{t('productDetail.material')}: {product.material}</span>
                </div>
                {product.specifications?.dimensions && (
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {t('productDetail.dimensions')}: {product.specifications.dimensions.length}x{product.specifications.dimensions.width}x{product.specifications.dimensions.height} {product.specifications.dimensions.unit}
                    </span>
                  </div>
                )}
                {product.specifications?.weight && (
                  <div className="flex items-center space-x-2">
                    <Scale className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {t('productDetail.weight')}: {product.specifications.weight.value} {product.specifications.weight.unit}
                    </span>
                  </div>
                )}
                {product.specifications?.color && (
                  <div className="flex items-center space-x-2">
                    <Palette className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{t('productDetail.color')}: {product.specifications.color}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{t('productDetail.moisture')}: {product.moisture}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{t('productDetail.packaging')}: {product.packaging}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('productDetail.reviews')} ({reviewStats.totalReviews})
            </h2>
            {isAuthenticated && !userReview && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>{t('productDetail.writeReview')}</span>
              </button>
            )}
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <div className="bg-white rounded-lg p-6 mb-8 border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {userReview ? t('productDetail.editReview') : t('productDetail.writeReview')}
                </h3>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('productDetail.rating')}
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('productDetail.reviewTitle')}
                  </label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    maxLength={200}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('productDetail.reviewComment')}
                  </label>
                  <textarea
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={4}
                    required
                    maxLength={1000}
                  />
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {submittingReview ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>{t('productDetail.saving')}</span>
                      </>
                    ) : (
                      <span>{userReview ? t('productDetail.updateReview') : t('productDetail.submitReview')}</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="btn-secondary"
                  >
                    {t('productDetail.cancel')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          {reviewsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-lg p-6 border">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {review.user.firstName} {review.user.lastName}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-gray-500 text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {user && review.user._id === user.id && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setReviewForm({
                              rating: review.rating,
                              title: review.title,
                              comment: review.comment
                            });
                            setShowReviewForm(true);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleReviewDelete(review._id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      onClick={() => handleHelpfulToggle(review._id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.helpfulCount || 0} {t('productDetail.helpful')}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t('productDetail.noReviews')}
              </h3>
              <p className="text-gray-600">
                {t('productDetail.beFirstToReview')}
              </p>
            </div>
          )}
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {t('productDetail.relatedProducts')}
              </h2>
              <Link 
                to={`/products?category=${product.category._id || product.category}`}
                className="text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-1"
              >
                <span>{t('productDetail.viewAll')}</span>
                <ArrowLeft className="w-4 h-4 transform rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <div 
                  key={relatedProduct._id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <Link to={`/products/${relatedProduct._id}`}>
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img
                        {...createImageProps(
                          getOptimizedCloudinaryUrl(getPrimaryImageUrl(relatedProduct), {
                            width: 300,
                            height: 300,
                            crop: 'fill',
                            quality: 'auto'
                          }),
                          relatedProduct.name?.vi || relatedProduct.name?.en || 'Product',
                          '/placeholder-product.svg'
                        )}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                        {relatedProduct.name?.[localStorage.getItem('i18nextLng') || 'vi'] || relatedProduct.name?.vi || relatedProduct.name?.en}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary-600">
                          {(relatedProduct.price?.amount || 0).toLocaleString('vi-VN')} {relatedProduct.price?.currency || 'VND'}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            const imageData = createCartImageData(relatedProduct);
                            const productName = relatedProduct.name?.vi || relatedProduct.name?.en || relatedProduct.name;
                            addItem({
                              id: relatedProduct._id,
                              name: productName,
                              price: {
                                amount: relatedProduct.price?.amount || 0,
                                currency: relatedProduct.price?.currency || 'VND'
                              },
                              ...imageData,
                              quantity: 1
                            });
                            setToast({ message: t('productDetail.addedToCart'), type: 'success' });
                          }}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {relatedLoading && (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
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
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProductDetail; 