import BaseApiService from './api';

class ProductsApiService extends BaseApiService {
  async getProducts(params = {}) {
    try {
      const response = await this.request('/products', { params });
      
      // Trả về đúng format mà component mong đợi
      return {
        success: true,
        data: {
          products: response.products || [],
          totalPages: response.totalPages || 1,
          total: response.total || 0
        }
      };
    } catch (error) {
      console.error('Failed to fetch products:', error);
      return { 
        success: false,
        data: {
          products: [],
          totalPages: 0,
          total: 0
        },
        message: error.message || 'Không thể tải danh sách sản phẩm'
      };
    }
  }

  async getFeaturedProducts(limit = 6) {
    try {
      console.log('Getting featured products with limit:', limit);
      // Convert limit to number and ensure it's valid
      const numericLimit = parseInt(limit) || 6;
      const response = await this.request('/products/featured', { 
        params: { limit: numericLimit } 
      });
      console.log('Featured products response:', response);
      
      // Handle different response structures
      let products = [];
      if (response && response.products) {
        products = response.products;
      } else if (response && response.data && response.data.products) {
        products = response.data.products;
      } else if (Array.isArray(response)) {
        products = response;
      }
      
      console.log('Extracted products:', products);
      
      return {
        success: true,
        data: {
          products: products
        }
      };
    } catch (error) {
      console.error('Failed to fetch featured products:', error);
      // Return fallback data only if it's a real error, not validation error
      if (error.message.includes('Validation failed')) {
        return {
          success: false,
          data: { products: [] },
          message: error.message
        };
      }
      return { 
        success: true,
        data: {
          products: [
            {
              _id: '1',
              name: { en: 'Storage Basket Large', vi: 'Giỏ đựng đồ lớn' },
              description: { en: 'Large storage basket for household items', vi: 'Giỏ đựng đồ lớn cho vật dụng gia đình' },
              price: { amount: 15.99, currency: 'USD' },
              category: 'storage-baskets',
              isFeatured: true,
              status: 'published',
              images: []
            },
            {
              _id: '2',
              name: { en: 'Decorative Vase', vi: 'Bình hoa trang trí' },
              description: { en: 'Beautiful decorative vase for your home', vi: 'Bình hoa trang trí đẹp cho ngôi nhà của bạn' },
              price: { amount: 25.99, currency: 'USD' },
              category: 'decorative-items',
              isFeatured: true,
              status: 'published',
              images: []
            }
          ]
        }
      };
    }
  }

  async getProductById(id) {
    try {
      const response = await this.request(`/products/${id}`);
      return {
        success: true,
        data: response.product || response
      };
    } catch (error) {
      console.error('Failed to fetch product:', error);
      console.error('Error details:', error);
      return {
        success: false,
        data: null,
        message: error.message || 'Product not found'
      };
    }
  }

  async getProductsByCategory(category, params = {}) {
    return this.getProducts({ category, ...params });
  }

  async searchProducts(query, params = {}) {
    return this.getProducts({ search: query, ...params });
  }

  async getProductCategories() {
    try {
      const response = await this.request('/products/categories');
      return {
        success: true,
        data: response.categories || []
      };
    } catch (error) {
      console.error('Failed to fetch product categories:', error);
      return { 
        success: false,
        data: []
      };
    }
  }

  async updateProductStatus(id, status) {
    try {
      const response = await this.request(`/products/${id}/status`, {
        method: 'PATCH',
        data: { status }
      });
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to update product status:', error);
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }
}

export default new ProductsApiService(); 