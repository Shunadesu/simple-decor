import BaseApiService from './api.js';

class WishlistApiService extends BaseApiService {
  constructor() {
    super();
  }

  // Get user's wishlist
  async getWishlist() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await this.request('/users/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      throw error;
    }
  }

  // Add product to wishlist
  async addToWishlist(productId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await this.request('/users/wishlist', {
        method: 'POST',
        data: { productId },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to add product to wishlist:', error);
      throw error;
    }
  }

  // Remove product from wishlist
  async removeFromWishlist(productId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await this.request(`/users/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to remove product from wishlist:', error);
      throw error;
    }
  }

  // Clear entire wishlist
  async clearWishlist() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await this.request('/users/wishlist', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      throw error;
    }
  }

  // Check if product is in wishlist
  async checkWishlistStatus(productId) {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return { isInWishlist: false };
      }

      const response = await this.request(`/users/wishlist/check/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response;
    } catch (error) {
      console.error('Failed to check wishlist status:', error);
      return { isInWishlist: false };
    }
  }

  // Toggle wishlist status (add if not in wishlist, remove if in wishlist)
  async toggleWishlist(productId) {
    try {
      const status = await this.checkWishlistStatus(productId);
      
      if (status.isInWishlist) {
        return await this.removeFromWishlist(productId);
      } else {
        return await this.addToWishlist(productId);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      throw error;
    }
  }
}

export default new WishlistApiService(); 