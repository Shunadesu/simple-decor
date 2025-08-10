import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin,
  Tag,
  ArrowRight
} from 'lucide-react';
import blogApi from '../services/blogApi';
import { getLocalizedProductName } from '../utils/productUtils';
import toast from 'react-hot-toast';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewIncremented, setViewIncremented] = useState(false);

  const currentLanguage = i18n.language || 'vi';

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    // Increment view count once per session
    if (post && !viewIncremented) {
      blogApi.incrementViewCount(id);
      setViewIncremented(true);
    }
  }, [post, id, viewIncremented]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await blogApi.getPostById(id);
      
      if (response.success && response.data) {
        setPost(response.data);
        
        // Fetch related posts from same category
        if (response.data.category) {
          const relatedResponse = await blogApi.getPosts({
            category: response.data.category,
            limit: 3,
            status: 'published'
          });
          
          if (relatedResponse.success) {
            // Filter out current post
            const filtered = relatedResponse.data.posts.filter(p => p._id !== id);
            setRelatedPosts(filtered.slice(0, 3));
          }
        }
      } else {
        setError(response.message || 'Không thể tải bài viết');
      }
    } catch (err) {
      console.error('Error fetching blog post:', err);
      setError('Đã xảy ra lỗi khi tải bài viết');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blogApi.getLocalizedTitle(post, currentLanguage);
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url);
        toast.success('Đã sao chép link bài viết');
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-32">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-32">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Không tìm thấy bài viết'}
            </h1>
            <p className="text-gray-600 mb-8">
              Bài viết bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
            </p>
            <Link 
              to="/blog"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <ArrowLeft size={16} />
              <span>Quay lại blog</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const title = blogApi.getLocalizedTitle(post, currentLanguage);
  const content = blogApi.getLocalizedContent(post, currentLanguage);
  const excerpt = blogApi.getLocalizedExcerpt(post, currentLanguage);
  const authorName = blogApi.getAuthorName(post);
  const authorRole = blogApi.getAuthorRole(post);
  const featuredImageUrl = blogApi.getFeaturedImageUrl(post);
  const readingTime = blogApi.getReadingTime(post);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gray-900 ">
        {featuredImageUrl && (
          <div className="absolute inset-0">
            <img
              src={featuredImageUrl}
              alt={title}
              className="w-full h-full object-cover opacity-40"
            />
          </div>
        )}
        <div className="relative container-custom py-20 lg:py-32">
          <div className="max-w-4xl">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-gray-300 mb-6">
              <Link to="/blog" className="hover:text-white transition-colors">
                Blog
              </Link>
              <span>/</span>
              <span className="text-gray-400">
                {getCategoryLabel(post.category)}
              </span>
            </div>

            {/* Category */}
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                {getCategoryLabel(post.category)}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {title}
            </h1>

            {/* Excerpt */}
            {excerpt && (
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                {excerpt}
              </p>
            )}

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-gray-300">
              <div className="flex items-center space-x-2">
                <User size={16} />
                <span>{authorName}</span>
                {authorRole && <span className="text-gray-400">• {authorRole}</span>}
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>{formatDate(post.publishedAt || post.createdAt)}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Clock size={16} />
                <span>{readingTime} phút đọc</span>
              </div>
              
              {post.viewCount && (
                <div className="flex items-center space-x-2">
                  <Eye size={16} />
                  <span>{post.viewCount} lượt xem</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="container-custom py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-xl shadow-lg p-8 lg:p-12">
                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  {content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>

                {/* Additional Images */}
                {post.images && post.images.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">
                      Hình ảnh bổ sung
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {post.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url}
                            alt={image.alt || `Blog image ${index + 1}`}
                            className="w-full h-64 object-cover rounded-lg"
                          />
                          {image.caption && image.caption[currentLanguage] && (
                            <p className="text-sm text-gray-600 mt-2 text-center">
                              {image.caption[currentLanguage]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex items-center flex-wrap gap-2">
                      <Tag size={16} className="text-gray-400" />
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {typeof tag === 'object' ? (tag[currentLanguage] || tag.vi || tag.en) : tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Chia sẻ bài viết
                  </h3>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Facebook size={16} />
                      <span>Facebook</span>
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      <Twitter size={16} />
                      <span>Twitter</span>
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors"
                    >
                      <Linkedin size={16} />
                      <span>LinkedIn</span>
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      <Share2 size={16} />
                      <span>Copy Link</span>
                    </button>
                  </div>
                </div>
              </article>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Back to Blog */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <Link
                  to="/blog"
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <ArrowLeft size={16} />
                  <span>Quay lại blog</span>
                </Link>
              </div>

              {/* Author Info */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Về tác giả
                </h3>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User size={20} className="text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{authorName}</p>
                    {authorRole && (
                      <p className="text-sm text-gray-600">{authorRole}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Bài viết liên quan
                  </h3>
                  <div className="space-y-4">
                    {relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost._id}
                        to={`/blog/${relatedPost._id}`}
                        className="block group"
                      >
                        <div className="flex space-x-3">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {blogApi.getFeaturedImageUrl(relatedPost) ? (
                              <img
                                src={blogApi.getFeaturedImageUrl(relatedPost)}
                                alt={blogApi.getLocalizedTitle(relatedPost, currentLanguage)}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-lg">{relatedPost.image || '📝'}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
                              {blogApi.getLocalizedTitle(relatedPost, currentLanguage)}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {formatDate(relatedPost.publishedAt || relatedPost.createdAt)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
