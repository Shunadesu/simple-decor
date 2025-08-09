import BaseApiService from './api';

class AuthApiService extends BaseApiService {
  async login(credentials) {
    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        data: credentials
      });
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        data: userData
      });
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await this.request('/auth/logout', {
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  async refreshToken() {
    try {
      const response = await this.request('/auth/refresh', {
        method: 'POST'
      });
      return response;
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await this.request('/auth/profile');
      return response;
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      throw error;
    }
  }

  async updateProfile(userData) {
    try {
      const response = await this.request('/auth/profile', {
        method: 'PUT',
        data: userData
      });
      return response;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  }
}

export default new AuthApiService(); 