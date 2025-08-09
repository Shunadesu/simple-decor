import BaseApiService from './api';

class CartApiService extends BaseApiService {
  async getUserCart(userId) {
    try {
      const response = await this.request(`/carts/user/${userId}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch user cart:', error);
      return { items: [], total: 0 };
    }
  }

  async addToCart(userId, itemData) {
    try {
      const response = await this.request(`/carts/user/${userId}/items`, {
        method: 'POST',
        data: itemData
      });
      return response;
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      throw error;
    }
  }

  async updateCartItem(userId, itemId, quantity) {
    try {
      const response = await this.request(`/carts/user/${userId}/items/${itemId}`, {
        method: 'PUT',
        data: { quantity }
      });
      return response;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  }

  async removeFromCart(userId, itemId) {
    try {
      const response = await this.request(`/carts/user/${userId}/items/${itemId}`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      throw error;
    }
  }

  async clearCart(userId) {
    try {
      const response = await this.request(`/carts/user/${userId}/clear`, {
        method: 'DELETE'
      });
      return response;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }

  async getCartSummary(userId) {
    try {
      const response = await this.request(`/carts/user/${userId}/summary`);
      return response;
    } catch (error) {
      console.error('Failed to fetch cart summary:', error);
      return { totalItems: 0, totalPrice: 0 };
    }
  }
}

export default new CartApiService(); 