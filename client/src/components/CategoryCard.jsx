import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category }) => {
  const { name, description, image, productCount, slug, _id } = category;
  
  // Use slug if available, otherwise use _id
  const categorySlug = slug || _id;

  // Handle name - could be string or object with {en, vi} keys
  const getDisplayName = () => {
    if (typeof name === 'string') return name;
    if (name && typeof name === 'object') {
      // Try to get the current language or fallback to English
      return name.en || name.vi || Object.values(name)[0] || 'Category Name';
    }
    return 'Category Name';
  };

  // Handle description - could be string or object with {en, vi} keys
  const getDisplayDescription = () => {
    if (typeof description === 'string') return description;
    if (description && typeof description === 'object') {
      // Try to get the current language or fallback to English
      return description.en || description.vi || Object.values(description)[0] || '';
    }
    return '';
  };

  const displayName = getDisplayName();
  const displayDescription = getDisplayDescription();

  return (
    <Link 
      to={`/products?category=${categorySlug}`}
      className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="relative h-48 overflow-hidden">
        {image && (image.url || typeof image === 'string') ? (
          <img
            src={image.url || image}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        
        {/* Fallback image */}
        <div className={`w-full h-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center ${image && (image.url || typeof image === 'string') ? 'hidden' : ''}`}>
          <span className="text-4xl">🏠</span>
        </div>
        
        <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300"></div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
            {displayName}
          </h3>
          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-300" />
        </div>
        
        {displayDescription && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {displayDescription}
          </p>
        )}
        
        {productCount && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {productCount} sản phẩm
            </span>
            <span className="text-green-600 font-medium text-sm">
              Xem tất cả
            </span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard; 