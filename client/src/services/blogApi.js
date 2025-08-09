import BaseApiService from './api';

class BlogApiService extends BaseApiService {
  async getPosts(params = {}) {
    try {
      const response = await this.request('/blog', { params });
      
      return {
        success: true,
        data: {
          posts: response.posts || [],
          total: response.total || 0,
          totalPages: response.totalPages || 1,
          currentPage: response.currentPage || 1
        }
      };
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
      return { 
        success: false,
        data: {
          posts: [],
          total: 0,
          totalPages: 0,
          currentPage: 1
        },
        message: error.message || 'Không thể tải danh sách bài viết'
      };
    }
  }

  async getPostById(id) {
    try {
      const response = await this.request(`/blog/${id}`);
      
      return {
        success: true,
        data: response.post || response
      };
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
      return { 
        success: false,
        data: null,
        message: error.message || 'Không thể tải bài viết'
      };
    }
  }

  async getFeaturedPosts(limit = 3) {
    try {
      const response = await this.request('/blog/featured', { 
        params: { limit } 
      });
      
      return {
        success: true,
        data: response.posts || []
      };
    } catch (error) {
      console.error('Failed to fetch featured posts:', error);
      return { 
        success: false,
        data: [],
        message: error.message || 'Không thể tải bài viết nổi bật'
      };
    }
  }

  async getCategories() {
    try {
      const response = await this.request('/blog/categories');
      
      return {
        success: true,
        data: response.categories || []
      };
    } catch (error) {
      console.error('Failed to fetch blog categories:', error);
      return { 
        success: false,
        data: [],
        message: error.message || 'Không thể tải danh mục bài viết'
      };
    }
  }

  async incrementViewCount(id) {
    try {
      await this.request(`/blog/${id}/view`, { method: 'POST' });
      return { success: true };
    } catch (error) {
      console.error('Failed to increment view count:', error);
      return { success: false };
    }
  }

  async searchPosts(searchTerm, params = {}) {
    try {
      const response = await this.request('/blog', { 
        params: { 
          search: searchTerm,
          ...params 
        } 
      });
      
      return {
        success: true,
        data: {
          posts: response.posts || [],
          total: response.total || 0,
          totalPages: response.totalPages || 1,
          currentPage: response.currentPage || 1
        }
      };
    } catch (error) {
      console.error('Failed to search blog posts:', error);
      return { 
        success: false,
        data: {
          posts: [],
          total: 0,
          totalPages: 0,
          currentPage: 1
        },
        message: error.message || 'Không thể tìm kiếm bài viết'
      };
    }
  }

  // Utility functions for handling multilingual content
  getLocalizedTitle(post, language = 'vi') {
    if (!post || !post.title) return '';
    
    if (typeof post.title === 'string') {
      return post.title;
    }
    
    if (typeof post.title === 'object') {
      return post.title[language] || 
             post.title.vi || 
             post.title.en || 
             Object.values(post.title)[0] || 
             '';
    }
    
    return '';
  }

  getLocalizedContent(post, language = 'vi') {
    if (!post || !post.content) return '';
    
    if (typeof post.content === 'string') {
      return post.content;
    }
    
    if (typeof post.content === 'object') {
      return post.content[language] || 
             post.content.vi || 
             post.content.en || 
             Object.values(post.content)[0] || 
             '';
    }
    
    return '';
  }

  getLocalizedExcerpt(post, language = 'vi') {
    if (!post || !post.excerpt) {
      // Fallback to content if no excerpt
      const content = this.getLocalizedContent(post, language);
      return content.substring(0, 150) + (content.length > 150 ? '...' : '');
    }
    
    if (typeof post.excerpt === 'string') {
      return post.excerpt;
    }
    
    if (typeof post.excerpt === 'object') {
      return post.excerpt[language] || 
             post.excerpt.vi || 
             post.excerpt.en || 
             Object.values(post.excerpt)[0] || 
             '';
    }
    
    return '';
  }

  getAuthorName(post) {
    if (!post || !post.author) return 'Unknown Author';
    
    if (typeof post.author === 'string') {
      return post.author;
    }
    
    if (typeof post.author === 'object') {
      return post.author.name || 'Unknown Author';
    }
    
    return 'Unknown Author';
  }

  getAuthorRole(post) {
    if (!post || !post.author) return '';
    
    if (typeof post.author === 'object') {
      return post.author.role || '';
    }
    
    return '';
  }

  getFeaturedImageUrl(post) {
    if (!post) return null;
    
    if (post.featuredImage && post.featuredImage.url) {
      return post.featuredImage.url;
    }
    
    // Fallback to first image if available
    if (post.images && post.images.length > 0) {
      return post.images[0].url;
    }
    
    return null;
  }

  getReadingTime(post) {
    if (!post) return 5;
    
    if (post.readingTime) {
      return post.readingTime;
    }
    
    // Calculate based on content length
    const content = this.getLocalizedContent(post);
    const wordCount = content.split(/\s+/).length;
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute) || 5;
  }
}

const blogApi = new BlogApiService();
export default blogApi;
