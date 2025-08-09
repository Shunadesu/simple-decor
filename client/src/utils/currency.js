// Currency utility functions

/**
 * Format price based on currency and locale
 * @param {number} amount - Price amount
 * @param {string} currency - Currency code (USD, EUR, VND)
 * @param {string} locale - Locale for formatting (default: auto-detect)
 * @returns {string} Formatted price string
 */
export const formatPrice = (amount, currency = 'VND', locale = null) => {
  if (!amount || amount === 0) return 'Liên hệ';
  
  // Auto-detect locale based on currency if not provided
  if (!locale) {
    switch (currency) {
      case 'VND':
        locale = 'vi-VN';
        break;
      case 'USD':
        locale = 'en-US';
        break;
      case 'EUR':
        locale = 'de-DE';
        break;
      default:
        locale = 'vi-VN'; // Default to Vietnamese
    }
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'VND' ? 0 : 2,
      maximumFractionDigits: currency === 'VND' ? 0 : 2,
    }).format(amount);
  } catch (error) {
    console.warn(`Currency formatting failed for ${currency}:`, error);
    // Fallback formatting
    return `${amount.toLocaleString(locale)} ${currency}`;
  }
};

/**
 * Convert price between currencies (simplified conversion for demo)
 * In production, you would use real-time exchange rates
 * @param {number} amount - Amount to convert
 * @param {string} fromCurrency - Source currency
 * @param {string} toCurrency - Target currency
 * @returns {number} Converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  // Simplified exchange rates (you should use real-time rates)
  const exchangeRates = {
    USD: {
      VND: 24000,
      EUR: 0.85,
    },
    VND: {
      USD: 1/24000,
      EUR: 1/28000,
    },
    EUR: {
      USD: 1.18,
      VND: 28000,
    }
  };
  
  if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
    return Math.round(amount * exchangeRates[fromCurrency][toCurrency]);
  }
  
  return amount; // Return original if conversion not available
};

/**
 * Get currency symbol
 * @param {string} currency - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currency) => {
  const symbols = {
    USD: '$',
    EUR: '€',
    VND: '₫',
  };
  return symbols[currency] || currency;
};

/**
 * Get default currency for the application
 * Can be configured based on user location or preferences
 * @returns {string} Default currency code
 */
export const getDefaultCurrency = () => {
  // You can implement logic to detect user location or preferences
  // For now, return VND as default for Vietnamese market
  return 'VND';
};

/**
 * Validate currency code
 * @param {string} currency - Currency code to validate
 * @returns {boolean} True if valid currency
 */
export const isValidCurrency = (currency) => {
  const validCurrencies = ['USD', 'EUR', 'VND'];
  return validCurrencies.includes(currency);
};

/**
 * Get product price with proper currency handling
 * @param {object} product - Product object
 * @param {string} targetCurrency - Target currency (optional)
 * @returns {object} Price object with amount and currency
 */
export const getProductPrice = (product, targetCurrency = null) => {
  if (!product || !product.price) {
    return { amount: 0, currency: getDefaultCurrency() };
  }
  
  const price = product.price;
  const amount = price.amount || price || 0;
  const currency = price.currency || getDefaultCurrency();
  
  if (targetCurrency && targetCurrency !== currency) {
    return {
      amount: convertCurrency(amount, currency, targetCurrency),
      currency: targetCurrency
    };
  }
  
  return { amount, currency };
};

/**
 * Calculate cart total with currency support
 * @param {array} cartItems - Array of cart items
 * @param {string} targetCurrency - Target currency for total
 * @returns {object} Total amount and currency
 */
export const calculateCartTotal = (cartItems, targetCurrency = null) => {
  if (!cartItems || cartItems.length === 0) {
    return { amount: 0, currency: getDefaultCurrency() };
  }
  
  const baseCurrency = targetCurrency || getDefaultCurrency();
  let total = 0;
  
  cartItems.forEach(item => {
    const itemPrice = item.price?.amount || item.price || 0;
    const itemCurrency = item.price?.currency || item.currency || baseCurrency;
    const quantity = item.quantity || 1;
    
    // Convert to base currency if different
    let convertedPrice = itemPrice;
    if (itemCurrency !== baseCurrency) {
      convertedPrice = convertCurrency(itemPrice, itemCurrency, baseCurrency);
    }
    
    total += convertedPrice * quantity;
  });
  
  return { amount: total, currency: baseCurrency };
};
