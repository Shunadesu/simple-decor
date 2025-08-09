import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Heart, Star, Truck, Shield, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useCartStore from '../stores/cartStore';
import useWishlistStore from '../stores/wishlistStore';
import toast from 'react-hot-toast';
import { createCartImageData } from '../utils/image';

const QuickViewModal = ({ product, isOpen, onClose }) => {
  const { t } = useTranslation();
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlistStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setCurrentImageIndex(0);
      setQuantity(1);
      setImageLoading(true);
      setImageError(false);
      setIsWishlisted(isInWishlist(product._id || product.id));
    }
  }, [product, isInWishlist]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevImage();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextImage();
          break;
        default:
          break;
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const {
    _id,
    id,
    name,
    description,
    price,
    images,
    category,
    material,
    specifications,
    stock,
    isFeatured,
    status
  } = product;

  const productId = _id || id;

  // Get display name
  const getDisplayName = () => {
    if (typeof name === 'string') return name;
    if (name && typeof name === 'object' && name !== null) {
      if (name.vi) return name.vi;
      if (name.en) return name.en;
      // If no vi/en, try to get first string value
      const values = Object.values(name);
      for (const value of values) {
        if (typeof value === 'string' && value.trim()) {
          return value;
        }
      }
    }
    return 'Product Name';
  };

  // Get display description
  const getDisplayDescription = () => {
    if (typeof description === 'string') return description;
    if (description && typeof description === 'object' && description !== null) {
      if (description.vi) return description.vi;
      if (description.en) return description.en;
      // If no vi/en, try to get first string value
      const values = Object.values(description);
      for (const value of values) {
        if (typeof value === 'string' && value.trim()) {
          return value;
        }
      }
    }
    return '';
  };

  const productName = getDisplayName();
  const productDescription = getDisplayDescription();
  const productPrice = price?.amount || 0;
  const currency = price?.currency || 'USD';

  // Get images
  const productImages = images || [];
  const currentImage = productImages[currentImageIndex] || productImages[0];

  const handleAddToCart = () => {
    const imageData = createCartImageData(product);
    addItem({
      id: productId,
      name: productName,
      price: {
        amount: productPrice,
        currency: currency
      },
      ...imageData,
      category: category,
      quantity: quantity
    });
    toast.success(`Đã thêm ${quantity} "${productName}" vào giỏ hàng!`);
    onClose();
  };

  const handleWishlistToggle = async () => {
    try {
      await toggleWishlist(product);
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const nextImage = () => {
    if (productImages.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
      setImageLoading(true);
      setImageError(false);
    }
  };

  const prevImage = () => {
    if (productImages.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
      setImageLoading(true);
      setImageError(false);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= (stock?.maxOrder || 100)) {
      setQuantity(newQuantity);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('quickView.title')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)] overflow-hidden">
            {/* Image Section */}
            <div className="lg:w-1/2 p-6">
              <div className="relative">
                {/* Main Image */}
                <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden bg-gray-100">
                  {currentImage && currentImage.url && !imageError ? (
                    <>
                      {imageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                        </div>
                      )}
                      <img
                        src={currentImage.url}
                        alt={productName}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${
                          imageLoading ? 'opacity-0' : 'opacity-100'
                        }`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-6xl">🛋️</span>
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                        aria-label="Previous image"
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
                        aria-label="Next image"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {productImages.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      {currentImageIndex + 1} / {productImages.length}
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {productImages.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImageIndex(index);
                          setImageLoading(true);
                          setImageError(false);
                        }}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                          index === currentImageIndex 
                            ? 'border-green-500' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        aria-label={`View image ${index + 1}`}
                      >
                        <img
                          src={image.url}
                          alt={`${productName} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Product Info Section */}
            <div className="lg:w-1/2 p-6 overflow-y-auto">
              {/* Category */}
              {category && (
                <div className="mb-2">
                  <span className="text-sm text-gray-500 uppercase tracking-wide">
                    {(() => {
                      if (typeof category === 'string') {
                        return category;
                      }
                      if (typeof category === 'object' && category !== null) {
                        // If category has a name property
                        if (category.name) {
                          if (typeof category.name === 'string') {
                            return category.name;
                          }
                          if (typeof category.name === 'object' && category.name !== null) {
                            if (category.name.vi) return category.name.vi;
                            if (category.name.en) return category.name.en;
                            // Try to get first string value from name object
                            const nameValues = Object.values(category.name);
                            for (const value of nameValues) {
                              if (typeof value === 'string' && value.trim()) {
                                return value;
                              }
                            }
                          }
                        }
                        // If category itself has vi/en properties
                        if (category.vi) return category.vi;
                        if (category.en) return category.en;
                        // If category is an object with other properties
                        if (Object.keys(category).length > 0) {
                          const values = Object.values(category);
                          for (const value of values) {
                            if (typeof value === 'string' && value.trim()) {
                              return value;
                            }
                          }
                        }
                      }
                      return 'Category';
                    })()}
                  </span>
                </div>
              )}

              {/* Product Name */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {productName}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">(4.0 - 12 reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-3xl font-bold text-green-600">
                  ${productPrice.toLocaleString()}
                </span>
                {currency !== 'USD' && (
                  <span className="text-sm text-gray-500 ml-2">
                    {currency}
                  </span>
                )}
              </div>

              {/* Description */}
              {productDescription && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('quickView.description')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {productDescription}
                  </p>
                </div>
              )}

              {/* Specifications */}
              {specifications && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('quickView.specifications')}
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {specifications.dimensions && (
                      <div>
                        <span className="text-sm text-gray-500">{t('quickView.dimensions')}</span>
                        <p className="font-medium">
                          {specifications.dimensions.length} × {specifications.dimensions.width} × {specifications.dimensions.height} {specifications.dimensions.unit}
                        </p>
                      </div>
                    )}
                    {specifications.weight && (
                      <div>
                        <span className="text-sm text-gray-500">{t('quickView.weight')}</span>
                        <p className="font-medium">
                          {specifications.weight.value} {specifications.weight.unit}
                        </p>
                      </div>
                    )}
                    {material && (
                      <div>
                        <span className="text-sm text-gray-500">{t('quickView.material')}</span>
                        <p className="font-medium">{material}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('quickView.quantity')}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={quantity >= (stock?.maxOrder || 100)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">
                    {stock?.quantity || 0} {t('quickView.available')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors duration-300 font-medium"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {t('quickView.addToCart')}
                </button>
                <button 
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className={`flex items-center justify-center gap-2 border px-6 py-3 rounded-lg transition-colors duration-300 ${
                    isWishlisted 
                      ? 'border-red-500 text-red-600 hover:bg-red-50' 
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  {isWishlisted ? t('quickView.removeFromWishlist') : t('quickView.wishlist')}
                </button>
              </div>

              {/* Features */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600">{t('quickView.freeShipping')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-gray-600">{t('quickView.securePayment')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal; 