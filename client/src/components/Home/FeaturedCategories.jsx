import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package } from 'lucide-react';
import { categoriesApi } from '../../services';

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCategories();
  }, []);

  const fetchFeaturedCategories = async () => {
    try {
      const response = await categoriesApi.getCategories({ 
        featured: true, 
        active: true, 
        limit: 4 
      });
      
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching featured categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayName = (category) => {
    if (typeof category.name === 'string') return category.name;
    if (category.name && typeof category.name === 'object') {
      const currentLang = localStorage.getItem('i18nextLng') || 'vi';
      return category.name[currentLang] || category.name.vi || category.name.en || 'Category';
    }
    return 'Category';
  };

  const getDisplayDescription = (category) => {
    if (typeof category.description === 'string') return category.description;
    if (category.description && typeof category.description === 'object') {
      const currentLang = localStorage.getItem('i18nextLng') || 'vi';
      return category.description[currentLang] || category.description.vi || category.description.en || '';
    }
    return '';
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Danh Mục Nổi Bật
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá các danh mục sản phẩm được yêu thích nhất
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-gray-50 rounded-xl overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Danh Mục Nổi Bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các danh mục sản phẩm được yêu thích nhất
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link
              key={category._id}
              to={`/products?category=${category.slug || category._id}`}
              className="group bg-gray-50 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={getDisplayName(category)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center">
                    <Package className="w-16 h-16 text-primary-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                {category.productCount && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-white text-gray-900 px-3 py-1 text-sm font-medium rounded-full shadow-lg">
                      {category.productCount} sản phẩm
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {getDisplayName(category)}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {getDisplayDescription(category) || 'Khám phá bộ sưu tập đa dạng với chất lượng tuyệt vời'}
                </p>

                <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                  <span className="text-sm">Xem sản phẩm</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Hiện tại chưa có danh mục nổi bật nào.</p>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/products"
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors duration-300"
          >
            Xem Tất Cả Danh Mục
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
