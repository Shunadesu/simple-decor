import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight, Clock, Eye, Search } from 'lucide-react';
import blogApi from '../services/blogApi';

const Blog = () => {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const currentLanguage = i18n.language || 'vi';

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, searchTerm, currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories and posts in parallel
      const [categoriesResponse, postsResponse] = await Promise.all([
        blogApi.getCategories(),
        blogApi.getPosts({ status: 'published', limit: 12 })
      ]);

      if (categoriesResponse.success) {
        const categoriesWithAll = [
          { id: 'all', name: 'Tất cả', count: postsResponse.data?.total || 0 },
          ...categoriesResponse.data.map(cat => ({
            id: cat.id || cat._id,
            name: cat.name,
            count: cat.count || 0
          }))
        ];
        setCategories(categoriesWithAll);
      }

      if (postsResponse.success) {
        setPosts(postsResponse.data.posts || []);
        setTotalPages(postsResponse.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching blog data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      const params = {
        status: 'published',
        limit: 12,
        page: currentPage
      };

      if (selectedCategory !== 'all') {
        params.category = selectedCategory;
      }

      if (searchTerm) {
        params.search = searchTerm;
      }

      const response = await blogApi.getPosts(params);
      
      if (response.success) {
        setPosts(response.data.posts || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const getCategoryLabel = (category) => {
    const categoryMap = {
      'internal-news': 'Tin nội bộ',
      'market-trends': 'Xu hướng thị trường',
      'knowledge': 'Bài viết kiến thức',
      'customer-stories': 'Chia sẻ khách hàng',
      'product-updates': 'Cập nhật sản phẩm',
      'sustainability': 'Bền vững',
      'design-tips': 'Mẹo thiết kế',
      'company-culture': 'Văn hóa công ty'
    };
    
    return categoryMap[category] || category;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (err) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
              <section className="bg-primary-50 text-primary-600 py-20 mt-24">
        <div className="container-custom text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            {t('nav.blog')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Cập nhật tin tức, xu hướng và kiến thức mới nhất
          </p>
        </div>
      </section>

      <div className="container-custom py-20">
        {/* Search & Categories */}
        <div className="mb-12">
          {/* Search */}
          <div className="mb-8">
            <div className="relative max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Danh Mục Bài Viết
            </h2>
            <div className="flex flex-wrap gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setCurrentPage(1);
                  }}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-primary-50'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Blog Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const title = blogApi.getLocalizedTitle(post, currentLanguage);
                const excerpt = blogApi.getLocalizedExcerpt(post, currentLanguage);
                const authorName = blogApi.getAuthorName(post);
                const featuredImageUrl = blogApi.getFeaturedImageUrl(post);
                const readingTime = blogApi.getReadingTime(post);
                
                return (
                  <Link 
                    key={post._id || post.id} 
                    to={`/blog/${post._id || post.id}`}
                    className="block group"
                  >
                    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                      {/* Featured Image */}
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        {featuredImageUrl ? (
                          <img
                            src={featuredImageUrl}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                            <span className="text-4xl">
                              {post.image || '📝'}
                            </span>
                          </div>
                        )}
                        
                        {/* Category Badge */}
                        <div className="relative -mt-8 ml-4">
                          <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                            {getCategoryLabel(post.category)}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        {/* Meta Information */}
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{formatDate(post.publishedAt || post.createdAt || post.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{readingTime} phút</span>
                            </div>
                          </div>
                          {post.isFeatured && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Nổi bật
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors line-clamp-1">
                          {title}
                        </h3>
                        
                        {/* Excerpt */}
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {excerpt}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                          {/* Author */}
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <User size={14} className="text-primary-600" />
                            </div>
                            <span className="text-sm text-gray-600">{authorName}</span>
                          </div>
                          
                          {/* Read More */}
                          <div className="flex items-center space-x-1 text-primary-600 group-hover:text-primary-700 font-medium">
                            <span className="text-sm">Đọc thêm</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {typeof tag === 'object' ? (tag[currentLanguage] || tag.vi || tag.en) : tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* View Count */}
                        {post.viewCount && (
                          <div className="flex items-center space-x-1 text-xs text-gray-400 mt-2">
                            <Eye size={12} />
                            <span>{post.viewCount} lượt xem</span>
                          </div>
                        )}
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>

            {/* No Posts Found */}
            {posts.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy bài viết
                </h3>
                <p className="text-gray-600">
                  Thử thay đổi từ khóa tìm kiếm hoặc danh mục để xem nhiều bài viết hơn.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang trước
                </button>
                
                <div className="flex items-center space-x-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === page
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-gray-400">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === totalPages
                            ? 'bg-primary-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trang sau
                </button>
              </div>
            )}
          </>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-24 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Đăng Ký Nhận Tin Tức
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Nhận những tin tức mới nhất về sản phẩm, xu hướng thị trường và kiến thức hữu ích
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="btn-primary px-8 py-3">
                Đăng Ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog; 