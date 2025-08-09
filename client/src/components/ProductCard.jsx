import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, Zap } from 'lucide-react';
import useCartStore from '../stores/cartStore';
import useWishlistStore from '../stores/wishlistStore';
import useAuthStore from '../stores/authStore';
import QuickViewModal from './QuickViewModal';
import toast from 'react-hot-toast';
import { formatPrice, getProductPrice } from '../utils/currency';
import { createCartImageData } from '../utils/image';
import { useLocalizedProductName, useLocalizedCategoryName } from '../utils/productUtils';

const ProductCard = ({ product }) => {
  const { addItem } = useCartStore();
  const { toggleWishlist, isInWishlist, isLoading: wishlistLoading } = useWishlistStore();
  const { isAuthenticated, logout } = useAuthStore();
  const [showQuickView, setShowQuickView] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  // Get localized names
  const localizedName = useLocalizedProductName(product);
  const localizedCategoryName = useLocalizedCategoryName(product.category);
  
  const { 
    _id, 
    id,
    name, 
    description, 
    price, 
    images, 
    category,
    isFeatured,
    status 
  } = product;

  // Use _id if available, otherwise use id
  const productId = _id || id;

  // Check wishlist status on component mount and when product changes
  useEffect(() => {
    setIsWishlisted(isInWishlist(productId));
  }, [productId, isInWishlist]);

  // Get the primary image or first image
  const primaryImage = images?.find(img => img.isPrimary) || images?.[0];
  
  // Handle image URL
  const getImageUrl = () => {
    if (primaryImage && primaryImage.url) {
      return primaryImage.url;
    }
    // Return a placeholder if no image is available
    return 'https://via.placeholder.com/300x200?text=Product+Image';
  };

  // Handle name - could be string or object with {en, vi} keys
  const getDisplayName = () => {
    if (typeof name === 'string') return name;
    if (name && typeof name === 'object' && name !== null) {
      // Try to get the current language or fallback to English
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

  // Handle description - could be string or object with {en, vi} keys
  const getDisplayDescription = () => {
    if (typeof description === 'string') return description;
    if (description && typeof description === 'object' && description !== null) {
      // Try to get the current language or fallback to English
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

  const productName = localizedName || 'Product Name';
  const productDescription = getDisplayDescription();
  
  // Get price with currency handling
  const priceInfo = getProductPrice(product);
  const productPrice = priceInfo.amount;
  const currency = priceInfo.currency;

  const handleAddToCart = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const imageData = createCartImageData(product);
    addItem({
      id: productId,
      name: productName,
      price: {
        amount: productPrice,
        currency: currency
      },
      ...imageData,
      category: category
    });
    toast.success(`Đã thêm "${productName}" vào giỏ hàng!`);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
      return;
    }
    
    try {
      await toggleWishlist(product);
      setIsWishlisted(!isWishlisted);
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      if (error.message === 'Invalid token' || error.message === 'Token expired') {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        logout(); // Clear auth state
      } else {
        toast.error('Không thể thêm vào danh sách yêu thích. Vui lòng thử lại');
      }
    }
  };

  return (
    <>
      <Link to={`/products/${productId}`} className="block group">
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={getImageUrl()}
              alt={productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  onError={(e) => {
                      e.target.src = '/placeholder-product.svg';
                    }}
            />
          
          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button 
                onClick={handleWishlistToggle}
                disabled={wishlistLoading}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors ${
                  isWishlisted 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                } ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={
                  !isAuthenticated 
                    ? 'Đăng nhập để thêm vào danh sách yêu thích' 
                    : isWishlisted 
                      ? 'Xóa khỏi danh sách yêu thích' 
                      : 'Thêm vào danh sách yêu thích'
                }
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleQuickView}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                title="Quick View"
              >
                <Zap className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Navigate to product detail page
                  window.location.href = `/products/${productId}`;
                }}
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                title="View Details"
              >
                <Eye className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Featured Badge */}
          {isFeatured && (
            <div className="absolute top-4 left-4">
              <span className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            </div>
          )}

          {/* Status Badge */}
          {status === 'published' && (
            <div className="absolute bottom-4 left-4">
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Available
              </span>
            </div>
          )}
          </div>

          {/* Content */}
          <div className="p-4">
          <div className="mb-2">
            {category && (
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {localizedCategoryName || (() => {
                  if (typeof category === 'string') {
                    return category;
                  }
                  if (typeof category === 'object' && category !== null) {
                    // Fallback logic for edge cases
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
            )}
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {productName}
          </h3>
          
          {productDescription && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {productDescription}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600">
                {formatPrice(productPrice, currency)}
              </span>
              {currency !== 'USD' && (
                <span className="text-sm text-gray-500">
                  {currency}
                </span>
              )}
            </div>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-300"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="text-sm font-medium">Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
      </Link>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};

export default ProductCard; 