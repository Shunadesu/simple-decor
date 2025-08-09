import { useTranslation } from 'react-i18next';

/**
 * Get localized product name based on current language
 * @param {Object} product - Product object with name.en and name.vi
 * @returns {string} - Localized product name
 */
export const getLocalizedProductName = (product, currentLanguage = 'en') => {
  if (!product || !product.name) {
    return '';
  }

  // If product.name is a string (legacy format), return as is
  if (typeof product.name === 'string') {
    return product.name;
  }

  // If product.name is an object with language keys
  if (typeof product.name === 'object') {
    // Get name for current language, fallback to English, then any available language
    return product.name[currentLanguage] || 
           product.name.en || 
           product.name.vi || 
           Object.values(product.name)[0] || 
           '';
  }

  return '';
};

/**
 * Get localized product description based on current language
 * @param {Object} product - Product object with description.en and description.vi
 * @returns {string} - Localized product description
 */
export const getLocalizedProductDescription = (product, currentLanguage = 'en') => {
  if (!product || !product.description) {
    return '';
  }

  // If product.description is a string (legacy format), return as is
  if (typeof product.description === 'string') {
    return product.description;
  }

  // If product.description is an object with language keys
  if (typeof product.description === 'object') {
    // Get description for current language, fallback to English, then any available language
    return product.description[currentLanguage] || 
           product.description.en || 
           product.description.vi || 
           Object.values(product.description)[0] || 
           '';
  }

  return '';
};

/**
 * Hook to get localized product name using current i18n language
 * @param {Object} product - Product object
 * @returns {string} - Localized product name
 */
export const useLocalizedProductName = (product) => {
  const { i18n } = useTranslation();
  return getLocalizedProductName(product, i18n.language);
};

/**
 * Hook to get localized product description using current i18n language
 * @param {Object} product - Product object
 * @returns {string} - Localized product description
 */
export const useLocalizedProductDescription = (product) => {
  const { i18n } = useTranslation();
  return getLocalizedProductDescription(product, i18n.language);
};

/**
 * Get localized category name based on current language
 * @param {Object} category - Category object with name.en and name.vi
 * @returns {string} - Localized category name
 */
export const getLocalizedCategoryName = (category, currentLanguage = 'en') => {
  if (!category || !category.name) {
    return '';
  }

  // If category.name is a string (legacy format), return as is
  if (typeof category.name === 'string') {
    return category.name;
  }

  // If category.name is an object with language keys
  if (typeof category.name === 'object') {
    // Get name for current language, fallback to English, then any available language
    return category.name[currentLanguage] || 
           category.name.en || 
           category.name.vi || 
           Object.values(category.name)[0] || 
           '';
  }

  return '';
};

/**
 * Hook to get localized category name using current i18n language
 * @param {Object} category - Category object
 * @returns {string} - Localized category name
 */
export const useLocalizedCategoryName = (category) => {
  const { i18n } = useTranslation();
  return getLocalizedCategoryName(category, i18n.language);
};
