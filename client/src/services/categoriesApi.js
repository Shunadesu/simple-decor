import BaseApiService from './api';

class CategoriesApiService extends BaseApiService {
  async getCategories(params = {}) {
    try {
      console.log('Getting categories with params:', params);
      
      // Clean up params to avoid validation errors
      const cleanParams = {
        include: 'productCount' // Always include product count
      };
      
      // Handle boolean parameters
      if (params.active !== undefined) {
        cleanParams.active = params.active === true || params.active === 'true' ? 'true' : 'false';
      }
      if (params.featured !== undefined) {
        cleanParams.featured = params.featured === true || params.featured === 'true' ? 'true' : 'false';
      }
      
      // Handle integer parameters
      if (params.limit) {
        cleanParams.limit = parseInt(params.limit).toString();
      }
      if (params.page) {
        cleanParams.page = parseInt(params.page).toString();
      }
      
      // Handle other parameters
      if (params.parent) cleanParams.parent = params.parent;
      if (params.level) cleanParams.level = parseInt(params.level).toString();
      
      console.log('Cleaned params:', cleanParams);
      
      const response = await this.request('/categories', { params: cleanParams });
      console.log('Categories response:', response);
      
      // Handle different response structures
      let categories = [];
      if (response && response.categories) {
        categories = response.categories;
      } else if (response && response.data) {
        categories = response.data;
      } else if (Array.isArray(response)) {
        categories = response;
      }
      
      console.log('Extracted categories:', categories);
      
      // Trả về đúng format mà component mong đợi
      return {
        success: true,
        data: categories,
        pagination: response.pagination
      };
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      // Return fallback data
      return { 
        success: false,
        data: [
          {
            _id: '1',
            name: { en: 'Storage Baskets', vi: 'Giỏ đựng đồ' },
            description: 'Beautiful storage solutions for your home',
            slug: 'storage-baskets',
            productCount: 0
          },
          {
            _id: '2', 
            name: { en: 'Decorative Items', vi: 'Đồ trang trí' },
            description: 'Elegant decorative pieces for your space',
            slug: 'decorative-items',
            productCount: 0
          },
          {
            _id: '3',
            name: { en: 'Kitchen Ware', vi: 'Đồ nhà bếp' },
            description: 'Functional and stylish kitchen accessories',
            slug: 'kitchen-ware', 
            productCount: 0
          }
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 3,
          pages: 1
        }
      };
    }
  }

  async getCategoryById(id) {
    try {
      const response = await this.request(`/categories/${id}`);
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('Failed to fetch category:', error);
      return {
        success: false,
        data: null,
        message: error.message
      };
    }
  }

  async getCategoryTree(params = {}) {
    try {
      const response = await this.request('/categories/tree', { params });
      return {
        success: true,
        data: response.categories || []
      };
    } catch (error) {
      console.error('Failed to fetch category tree:', error);
      return { 
        success: false,
        data: []
      };
    }
  }
}

export default new CategoriesApiService(); 