import api from './api';

class ReviewsApiService {
  // Get reviews for a product
  async getProductReviews(productId, options = {}) {
    try {
      const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = options;
      const response = await api.get(`/api/reviews/product/${productId}`, {
        params: { page, limit, sort, order }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }

  // Create a new review
  async createReview(reviewData) {
    try {
      const response = await api.post('/api/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  }

  // Update a review
  async updateReview(reviewId, reviewData) {
    try {
      const response = await api.put(`/api/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  }

  // Delete a review
  async deleteReview(reviewId) {
    try {
      const response = await api.delete(`/api/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  }

  // Mark review as helpful
  async toggleHelpful(reviewId) {
    try {
      const response = await api.post(`/api/reviews/${reviewId}/helpful`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to toggle helpful status');
    }
  }

  // Get user's reviews
  async getUserReviews(options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const response = await api.get('/api/reviews/user', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user reviews');
    }
  }
}

const reviewsApi = new ReviewsApiService();

// Export individual functions
export const getProductReviews = (productId, options) => reviewsApi.getProductReviews(productId, options);
export const createReview = (reviewData) => reviewsApi.createReview(reviewData);
export const updateReview = (reviewId, reviewData) => reviewsApi.updateReview(reviewId, reviewData);
export const deleteReview = (reviewId) => reviewsApi.deleteReview(reviewId);
export const toggleHelpful = (reviewId) => reviewsApi.toggleHelpful(reviewId);
export const getUserReviews = (options) => reviewsApi.getUserReviews(options);

export default reviewsApi; 