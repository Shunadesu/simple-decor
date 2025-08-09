import BaseApiService from './api';

class OrderApiService extends BaseApiService {
  // Get all orders for authenticated user
  async getUserOrders() {
    try {
      const response = await this.request('/orders/user');
      return response;
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      throw error;
    }
  }

  // Get guest orders by email
  async getGuestOrders(email, orderNumber = null) {
    try {
      const params = new URLSearchParams({ email });
      if (orderNumber) {
        params.append('orderNumber', orderNumber);
      }
      const response = await this.request(`/orders/guest?${params.toString()}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch guest orders:', error);
      throw error;
    }
  }

  // Get order by ID
  async getOrderById(orderId, email = null) {
    try {
      const params = email ? `?email=${encodeURIComponent(email)}` : '';
      const response = await this.request(`/orders/${orderId}${params}`);
      return response;
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  }

  // Create order directly (without cart)
  async createOrder(orderData) {
    try {
      const response = await this.request('/orders', {
        method: 'POST',
        data: orderData
      });
      return response;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  // Create order from user cart
  async createOrderFromUserCart(orderData) {
    try {
      const response = await this.request('/orders/from-cart', {
        method: 'POST',
        data: orderData
      });
      return response;
    } catch (error) {
      console.error('Failed to create order from cart:', error);
      throw error;
    }
  }

  // Create order from guest cart
  async createOrderFromGuestCart(orderData) {
    try {
      const response = await this.request('/orders/from-guest-cart', {
        method: 'POST',
        data: orderData
      });
      return response;
    } catch (error) {
      console.error('Failed to create order from guest cart:', error);
      throw error;
    }
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId, status) {
    try {
      const response = await this.request(`/orders/${orderId}/status`, {
        method: 'PATCH',
        data: { status }
      });
      return response;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }

  // Update payment status (admin only)
  async updatePaymentStatus(orderId, paymentStatus) {
    try {
      const response = await this.request(`/orders/${orderId}/payment`, {
        method: 'PATCH',
        data: { paymentStatus }
      });
      return response;
    } catch (error) {
      console.error('Failed to update payment status:', error);
      throw error;
    }
  }

  // Cancel order
  async cancelOrder(orderId, reason = null) {
    try {
      const response = await this.request(`/orders/${orderId}/cancel`, {
        method: 'PATCH',
        data: { reason }
      });
      return response;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }

  // Generate guest cart ID for guest users
  generateGuestId() {
    return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Get or create guest ID from localStorage
  getOrCreateGuestId() {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = this.generateGuestId();
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  }

  // Clear guest ID from localStorage
  clearGuestId() {
    localStorage.removeItem('guestId');
  }
}

export default new OrderApiService();
