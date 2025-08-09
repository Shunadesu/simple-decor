import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useCartStore from '../stores/cartStore';
import { formatPrice } from '../utils/currency';
import { getCartItemImageUrl, createImageProps } from '../utils/image';

const CartModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPriceWithCurrency, clearCart, currency } = useCartStore();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {t('cart.title')} ({getTotalItems()} {t('cart.items')})
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-6">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl">🛒</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {t('cart.empty')}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t('cart.emptyDescription')}
                </p>
                <Link
                  to="/products"
                  onClick={onClose}
                  className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {t('cart.continueShopping')}
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img
                        {...createImageProps(
                          getCartItemImageUrl(item),
                          item.name,
                          '/placeholder-product.svg'
                        )}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {formatPrice(
                          item.price?.amount || item.price || 0, 
                          item.price?.currency || item.currency || currency
                        )}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-gray-900">
                        {formatPrice(
                          (item.price?.amount || item.price || 0) * item.quantity,
                          item.price?.currency || item.currency || currency
                        )}
                      </p>
                    </div>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">{t('cart.total')}:</span>
                <span className="text-2xl font-bold text-primary-600">
                  {(() => {
                    const total = getTotalPriceWithCurrency();
                    return formatPrice(total.amount, total.currency);
                  })()}
                </span>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t('cart.clear')}
                </button>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-center"
                >
                  {t('cart.checkout')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartModal; 