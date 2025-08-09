import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Loader2, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { productsApi } from '../services';
import { getPrimaryImageUrl } from '../utils/image';
import { formatPrice, getProductPrice } from '../utils/currency';
import { getLocalizedProductName } from '../utils/productUtils';

const SearchModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const searchInputRef = useRef(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Search products with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch(searchTerm.trim());
      } else {
        setSearchResults([]);
        setError(null);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const performSearch = async (query) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await productsApi.searchProducts(query, {
        limit: 8,
        status: 'published',
        isActive: true
      });

      if (response.success) {
        setSearchResults(response.data.products || []);
      } else {
        setError(response.message || 'Lỗi tìm kiếm');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Lỗi khi tìm kiếm sản phẩm');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    
    const updatedSearches = [
      query.trim(),
      ...recentSearches.filter(search => search !== query.trim())
    ].slice(0, 5); // Keep only 5 recent searches
    
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleSearch = (query = searchTerm) => {
    if (!query.trim()) return;
    
    saveRecentSearch(query);
    navigate(`/products?search=${encodeURIComponent(query)}`);
    onClose();
  };

  const handleProductClick = (product) => {
    saveRecentSearch(searchTerm);
    navigate(`/products/${product._id}`);
    onClose();
  };

  const handleRecentSearchClick = (query) => {
    setSearchTerm(query);
    performSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        handleProductClick(searchResults[selectedIndex]);
      } else {
        handleSearch();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    }
  };

  // Use the utility function for consistent localized names
  const getLocalizedName = (product) => {
    return getLocalizedProductName(product, i18n.language);
  };

  const highlightSearchTerm = (text, term) => {
    if (!term) return text;
    
    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 font-medium">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
            />
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close search"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-primary-500" size={24} />
              <span className="ml-2 text-gray-600">{t('search.searching')}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-4 text-center text-red-600">
              {error}
            </div>
          )}

          {/* Search Results */}
          {!loading && !error && searchTerm.trim().length >= 2 && (
            <div>
              {searchResults.length > 0 ? (
                <div>
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                    <p className="text-sm text-gray-600">
                      {t('search.productsFound', { count: searchResults.length })}
                    </p>
                  </div>
                  {searchResults.map((product, index) => {
                    const priceInfo = getProductPrice(product);
                    const productName = getLocalizedName(product);
                    
                    return (
                      <div
                        key={product._id}
                        onClick={() => handleProductClick(product)}
                        className={`flex items-center p-4 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                          selectedIndex === index ? 'bg-primary-50' : ''
                        }`}
                      >
                        <img
                          src={getPrimaryImageUrl(product)}
                          alt={productName}
                          className="w-12 h-12 object-cover rounded-lg mr-4 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {highlightSearchTerm(productName, searchTerm)}
                          </h3>
                          <p className="text-sm text-primary-600 font-semibold">
                            {formatPrice(priceInfo.amount, priceInfo.currency)}
                          </p>
                        </div>
                        <ArrowRight size={16} className="text-gray-400 ml-2" />
                      </div>
                    );
                  })}
                  
                  {/* View All Results */}
                  <div
                    onClick={() => handleSearch()}
                    className="flex items-center justify-center p-4 cursor-pointer hover:bg-gray-50 border-t border-gray-200 text-primary-600 font-medium"
                  >
                    Xem tất cả kết quả cho "{searchTerm}"
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Search size={48} className="mx-auto mb-4 text-gray-300" />
                  <p>Không tìm thấy sản phẩm nào cho "{searchTerm}"</p>
                  <p className="text-sm mt-2">
                    Hãy thử tìm kiếm với từ khóa khác
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recent Searches */}
          {!searchTerm.trim() && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Tìm kiếm gần đây</h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Xóa tất cả
                </button>
              </div>
              {recentSearches.map((search, index) => (
                <div
                  key={index}
                  onClick={() => handleRecentSearchClick(search)}
                  className="flex items-center p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <Search size={16} className="text-gray-400 mr-3" />
                  <span className="text-gray-700">{search}</span>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!searchTerm.trim() && recentSearches.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <Search size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Tìm kiếm sản phẩm</p>
              <p className="text-sm">
                Nhập từ khóa để tìm kiếm sản phẩm bạn cần
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Nhấn Enter để tìm kiếm</span>
            <span>ESC để đóng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
