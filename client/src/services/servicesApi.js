import BaseApiService from './api';

class ServicesApiService extends BaseApiService {
  async getServices(params = {}) {
    try {
      const response = await this.request('/services', { params });
      
      return {
        success: true,
        data: {
          services: response.services || [],
          pagination: response.pagination || {}
        }
      };
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return { 
        success: false,
        data: {
          services: [],
          pagination: {}
        },
        message: error.message || 'Không thể tải danh sách dịch vụ'
      };
    }
  }

  async getServiceById(id, incrementView = false) {
    try {
      const params = incrementView ? { increment_view: 'true' } : {};
      const response = await this.request(`/services/${id}`, { params });
      
      return {
        success: true,
        data: response.service || response
      };
    } catch (error) {
      console.error('Failed to fetch service:', error);
      return { 
        success: false,
        data: null,
        message: error.message || 'Không thể tải thông tin dịch vụ'
      };
    }
  }

  async getFeaturedServices(limit = 6) {
    try {
      const response = await this.request('/services/featured', { 
        params: { limit } 
      });
      
      return {
        success: true,
        data: response.services || []
      };
    } catch (error) {
      console.error('Failed to fetch featured services:', error);
      return { 
        success: false,
        data: [],
        message: error.message || 'Không thể tải dịch vụ nổi bật'
      };
    }
  }

  async getServiceCategories() {
    try {
      const response = await this.request('/services/categories');
      
      return {
        success: true,
        data: response.categories || []
      };
    } catch (error) {
      console.error('Failed to fetch service categories:', error);
      return { 
        success: false,
        data: [],
        message: error.message || 'Không thể tải danh mục dịch vụ'
      };
    }
  }

  async searchServices(searchTerm, params = {}) {
    try {
      const response = await this.request('/services', { 
        params: { 
          search: searchTerm,
          ...params 
        } 
      });
      
      return {
        success: true,
        data: {
          services: response.services || [],
          pagination: response.pagination || {}
        }
      };
    } catch (error) {
      console.error('Failed to search services:', error);
      return { 
        success: false,
        data: {
          services: [],
          pagination: {}
        },
        message: error.message || 'Không thể tìm kiếm dịch vụ'
      };
    }
  }

  async recordServiceInquiry(serviceId, inquiryData) {
    try {
      const response = await this.request(`/services/${serviceId}/inquiry`, {
        method: 'POST',
        data: inquiryData
      });
      
      return {
        success: true,
        message: response.message || 'Yêu cầu tư vấn đã được gửi thành công'
      };
    } catch (error) {
      console.error('Failed to record service inquiry:', error);
      return { 
        success: false,
        message: error.message || 'Không thể gửi yêu cầu tư vấn'
      };
    }
  }

  // Admin methods
  async getAllServices(params = {}) {
    try {
      const response = await this.request('/services/admin/all', { params });
      
      return {
        success: true,
        data: {
          services: response.services || [],
          pagination: response.pagination || {}
        }
      };
    } catch (error) {
      console.error('Failed to fetch all services:', error);
      return { 
        success: false,
        data: {
          services: [],
          pagination: {}
        },
        message: error.message || 'Không thể tải danh sách dịch vụ'
      };
    }
  }

  async createService(serviceData) {
    try {
      const response = await this.request('/services/admin', {
        method: 'POST',
        data: serviceData
      });
      
      return {
        success: true,
        data: response.service,
        message: response.message || 'Tạo dịch vụ thành công'
      };
    } catch (error) {
      console.error('Failed to create service:', error);
      return { 
        success: false,
        message: error.message || 'Không thể tạo dịch vụ'
      };
    }
  }

  async updateService(id, serviceData) {
    try {
      const response = await this.request(`/services/admin/${id}`, {
        method: 'PUT',
        data: serviceData
      });
      
      return {
        success: true,
        data: response.service,
        message: response.message || 'Cập nhật dịch vụ thành công'
      };
    } catch (error) {
      console.error('Failed to update service:', error);
      return { 
        success: false,
        message: error.message || 'Không thể cập nhật dịch vụ'
      };
    }
  }

  async toggleFeaturedStatus(id, isFeatured) {
    try {
      const response = await this.request(`/services/admin/${id}/featured`, {
        method: 'PATCH',
        data: { isFeatured }
      });
      
      return {
        success: true,
        data: response.service,
        message: response.message || 'Cập nhật trạng thái nổi bật thành công'
      };
    } catch (error) {
      console.error('Failed to toggle featured status:', error);
      return { 
        success: false,
        message: error.message || 'Không thể cập nhật trạng thái nổi bật'
      };
    }
  }

  async deleteService(id) {
    try {
      const response = await this.request(`/services/admin/${id}`, {
        method: 'DELETE'
      });
      
      return {
        success: true,
        message: response.message || 'Xóa dịch vụ thành công'
      };
    } catch (error) {
      console.error('Failed to delete service:', error);
      return { 
        success: false,
        message: error.message || 'Không thể xóa dịch vụ'
      };
    }
  }

  async getServiceStats() {
    try {
      const response = await this.request('/services/admin/stats');
      
      return {
        success: true,
        data: response.stats || {}
      };
    } catch (error) {
      console.error('Failed to fetch service stats:', error);
      return { 
        success: false,
        data: {},
        message: error.message || 'Không thể tải thống kê dịch vụ'
      };
    }
  }

  // Utility functions for handling multilingual content
  getLocalizedTitle(service, language = 'vi') {
    if (!service || !service.title) return '';
    
    if (typeof service.title === 'string') {
      return service.title;
    }
    
    if (typeof service.title === 'object') {
      return service.title[language] || 
             service.title.vi || 
             service.title.en || 
             Object.values(service.title)[0] || 
             '';
    }
    
    return '';
  }

  getLocalizedDescription(service, language = 'vi') {
    if (!service || !service.description) return '';
    
    if (typeof service.description === 'string') {
      return service.description;
    }
    
    if (typeof service.description === 'object') {
      return service.description[language] || 
             service.description.vi || 
             service.description.en || 
             Object.values(service.description)[0] || 
             '';
    }
    
    return '';
  }

  getLocalizedShortDescription(service, language = 'vi') {
    if (!service || !service.shortDescription) {
      // Fallback to description
      const description = this.getLocalizedDescription(service, language);
      return description.substring(0, 150) + (description.length > 150 ? '...' : '');
    }
    
    if (typeof service.shortDescription === 'string') {
      return service.shortDescription;
    }
    
    if (typeof service.shortDescription === 'object') {
      return service.shortDescription[language] || 
             service.shortDescription.vi || 
             service.shortDescription.en || 
             Object.values(service.shortDescription)[0] || 
             '';
    }
    
    return '';
  }

  getLocalizedFeatures(service, language = 'vi') {
    if (!service || !service.features || !Array.isArray(service.features)) {
      return [];
    }
    
    return service.features.map(feature => {
      if (typeof feature === 'string') {
        return feature;
      }
      
      if (typeof feature === 'object') {
        return feature[language] || 
               feature.vi || 
               feature.en || 
               Object.values(feature)[0] || 
               '';
      }
      
      return '';
    }).filter(Boolean);
  }

  getCategoryLabel(category, language = 'vi') {
    const categoryMap = {
      consultation: { en: 'Consultation', vi: 'Tư vấn' },
      documentation: { en: 'Documentation', vi: 'Giấy tờ' },
      logistics: { en: 'Logistics', vi: 'Vận chuyển' },
      quality: { en: 'Quality Control', vi: 'Kiểm soát chất lượng' },
      support: { en: 'Support', vi: 'Hỗ trợ' },
      manufacturing: { en: 'Manufacturing', vi: 'Sản xuất' },
      export: { en: 'Export', vi: 'Xuất khẩu' },
      technology: { en: 'Technology', vi: 'Công nghệ' },
      design: { en: 'Design', vi: 'Thiết kế' },
      other: { en: 'Other', vi: 'Khác' }
    };
    
    return categoryMap[category]?.[language] || category;
  }

  getIconComponent(iconName) {
    // Map icon names to actual Lucide React components
    const iconMap = {
      Users: 'Users',
      FileText: 'FileText',
      Ship: 'Ship',
      Shield: 'Shield',
      Headphones: 'Headphones',
      Settings: 'Settings',
      Truck: 'Truck',
      Heart: 'Heart',
      Award: 'Award',
      Zap: 'Zap',
      Globe: 'Globe',
      Wrench: 'Wrench',
      CheckCircle: 'CheckCircle',
      Package: 'Package',
      Search: 'Search',
      Clock: 'Clock',
      Star: 'Star',
      Target: 'Target',
      Layers: 'Layers',
      Database: 'Database'
    };
    
    return iconMap[iconName] || 'Settings';
  }

  getServiceImageUrl(service) {
    if (!service) return null;
    
    if (service.image && service.image.url) {
      return service.image.url;
    }
    
    return null;
  }

  getPriceLabel(priceType, language = 'vi') {
    const priceMap = {
      free: { en: 'Free', vi: 'Miễn phí' },
      negotiable: { en: 'Negotiable', vi: 'Thỏa thuận' },
      contact: { en: 'Contact for pricing', vi: 'Liên hệ để biết giá' },
      included: { en: 'Included in package', vi: 'Bao gồm trong gói' }
    };
    
    return priceMap[priceType]?.[language] || priceMap.contact[language];
  }
}

const servicesApi = new ServicesApiService();
export default servicesApi;
