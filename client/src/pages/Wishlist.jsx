import React, { useState, useEffect } from 'react';
import { Heart, Trash2, ShoppingCart, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProductCard from '../components/ProductCard';
import useWishlistStore from '../stores/wishlistStore';
import useCartStore from '../stores/cartStore';

const Wishlist = () => {
  const { t } = useTranslation();
  const { 
    items: wishlistItems, 
    isLoading, 
    error, 
    fetchWishlist, 
    removeFromWishlist, 
    clearWishlist,
    getWishlistCount 
  } = useWishlistStore();
  const { addItem } = useCartStore();
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromWishlist(productId);
      setSelectedItems(prev => prev.filter(id => id !== productId));
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleRemoveSelected = async () => {
    try {
      for (const productId of selectedItems) {
        await removeFromWishlist(productId);
      }
      setSelectedItems([]);
    } catch (error) {
      console.error('Failed to remove selected items:', error);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm(t('wishlist.clearConfirm'))) {
      try {
        await clearWishlist();
        setSelectedItems([]);
      } catch (error) {
        console.error('Failed to clear wishlist:', error);
      }
    }
  };

  const handleAddToCart = (product) => {
    addItem({
      id: product._id || product.id,
      name: typeof product.name === 'string' ? product.name : product.name?.en || product.name?.vi || 'Product',
      price: product.price?.amount || product.price || 0,
      images: product.images || [],
      category: product.category
    });
  };

  const handleSelectItem = (productId) => {
    setSelectedItems(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map(item => item.product._id || item.product.id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchWishlist}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              {t('common.retry')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t('wishlist.title')}
                </h1>
                <p className="text-gray-600">
                  {getWishlistCount()} {t('wishlist.items')}
                </p>
              </div>
            </div>
            
            {wishlistItems.length > 0 && (
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSelectAll}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {selectedItems.length === wishlistItems.length 
                    ? t('wishlist.deselectAll') 
                    : t('wishlist.selectAll')
                  }
                </button>
                
                {selectedItems.length > 0 && (
                  <button
                    onClick={handleRemoveSelected}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('wishlist.removeSelected')} ({selectedItems.length})
                  </button>
                )}
                
                <button
                  onClick={handleClearWishlist}
                  className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  {t('wishlist.clearAll')}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Wishlist Items */}
        {wishlistItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t('wishlist.emptyTitle')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('wishlist.emptyDescription')}
            </p>
            <a
              href="/products"
                              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              {t('wishlist.browseProducts')}
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const product = item.product;
              const productId = product._id || product.id;
              const isSelected = selectedItems.includes(productId);
              
              return (
                <div key={productId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Selection Checkbox */}
                  <div className="p-4 border-b">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectItem(productId)}
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <span className="text-sm text-gray-600">
                        {t('wishlist.select')}
                      </span>
                    </label>
                  </div>
                  
                  {/* Product Card */}
                  <div className="p-4">
                    <ProductCard product={product} />
                  </div>
                  
                  {/* Actions */}
                  <div className="p-4 border-t bg-gray-50">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                      >
                        <ShoppingCart className="h-4 w-4" />
                        {t('wishlist.addToCart')}
                      </button>
                      
                      <button
                        onClick={() => handleRemoveItem(productId)}
                        className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        {t('wishlist.remove')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 