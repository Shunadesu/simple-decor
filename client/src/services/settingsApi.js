import BaseApiService from './api';

class SettingsApiService extends BaseApiService {
  // Get application settings
  async getSettings() {
    try {
      const response = await this.request('/settings');
      return response;
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      throw error;
    }
  }

  // Get currency exchange rates
  async getCurrencyRates() {
    try {
      const response = await this.request('/settings/currency-rates');
      return response;
    } catch (error) {
      console.error('Failed to fetch currency rates:', error);
      throw error;
    }
  }

  // Convert currency
  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      const response = await this.request('/settings/convert-currency', {
        method: 'POST',
        data: {
          amount,
          fromCurrency,
          toCurrency
        }
      });
      return response;
    } catch (error) {
      console.error('Failed to convert currency:', error);
      throw error;
    }
  }
}

export default new SettingsApiService();
