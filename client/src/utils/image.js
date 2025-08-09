// Image utility functions for consistent image handling

/**
 * Get the primary image URL from a product
 * @param {object} product - Product object with images array
 * @returns {string} Primary image URL or placeholder
 */
export const getPrimaryImageUrl = (product) => {
  if (!product || !product.images || !Array.isArray(product.images) || product.images.length === 0) {
    return '/placeholder-product.svg';
  }

  // Find primary image first
  const primaryImage = product.images.find(img => img.isPrimary === true);
  if (primaryImage && primaryImage.url) {
    return primaryImage.url;
  }

  // Fallback to first image
  const firstImage = product.images[0];
  if (firstImage && firstImage.url) {
    return firstImage.url;
  }

  return '/placeholder-product.jpg';
};

/**
 * Get image URL from cart item (handles both image and images formats)
 * @param {object} item - Cart item object
 * @returns {string} Image URL or placeholder
 */
export const getCartItemImageUrl = (item) => {
  if (!item) {
    return '/placeholder-product.svg';
  }

  // Check if item has direct image URL (string)
  if (item.image && typeof item.image === 'string') {
    return item.image;
  }

  // Check if item has images array
  if (item.images && Array.isArray(item.images) && item.images.length > 0) {
    // Find primary image first
    const primaryImage = item.images.find(img => img.isPrimary === true);
    if (primaryImage && primaryImage.url) {
      return primaryImage.url;
    }

    // Fallback to first image
    const firstImage = item.images[0];
    if (firstImage) {
      // Handle both string and object formats
      if (typeof firstImage === 'string') {
        return firstImage;
      }
      if (firstImage.url) {
        return firstImage.url;
      }
    }
  }

  return '/placeholder-product.jpg';
};

/**
 * Get all image URLs from a product
 * @param {object} product - Product object with images array
 * @returns {array} Array of image URLs
 */
export const getAllImageUrls = (product) => {
  if (!product || !product.images || !Array.isArray(product.images)) {
    return ['/placeholder-product.jpg'];
  }

  const imageUrls = product.images
    .filter(img => img && img.url)
    .map(img => img.url);

  return imageUrls.length > 0 ? imageUrls : ['/placeholder-product.svg'];
};

/**
 * Create standardized image data for cart items
 * @param {object} product - Product object
 * @returns {object} Standardized image data
 */
export const createCartImageData = (product) => {
  const primaryImageUrl = getPrimaryImageUrl(product);
  const allImages = product?.images || [];

  return {
    image: primaryImageUrl,          // Single image URL for compatibility
    images: allImages,               // Full images array with metadata
    primaryImage: primaryImageUrl    // Explicit primary image URL
  };
};

/**
 * Get image with error handling for React components
 * @param {string} imageUrl - Image URL to validate
 * @param {string} fallback - Fallback URL if main image fails
 * @returns {string} Valid image URL
 */
export const getValidImageUrl = (imageUrl, fallback = '/placeholder-product.svg') => {
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return fallback;
  }

  // Basic URL validation
  try {
    new URL(imageUrl);
    return imageUrl;
  } catch {
    // If not a valid URL, check if it's a relative path
    if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
      return imageUrl;
    }
    return fallback;
  }
};

/**
 * Create image props for img elements with error handling
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text
 * @param {string} fallback - Fallback image URL
 * @returns {object} Props object for img element
 */
export const createImageProps = (src, alt = '', fallback = '/placeholder-product.svg') => {
  return {
    src: getValidImageUrl(src, fallback),
    alt: alt || 'Product image',
    onError: (e) => {
      if (e.target.src !== fallback) {
        e.target.src = fallback;
      }
    },
    loading: 'lazy'
  };
};

/**
 * Generate placeholder image with text
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display
 * @returns {string} Placeholder image URL
 */
export const getPlaceholderImage = (width = 300, height = 200, text = 'Product Image') => {
  return `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(text)}`;
};

/**
 * Check if an image URL is from Cloudinary
 * @param {string} url - Image URL
 * @returns {boolean} True if Cloudinary URL
 */
export const isCloudinaryUrl = (url) => {
  return url && url.includes('cloudinary.com');
};

/**
 * Get optimized Cloudinary URL with transformations
 * @param {string} url - Original Cloudinary URL
 * @param {object} options - Transformation options
 * @returns {string} Optimized URL
 */
export const getOptimizedCloudinaryUrl = (url, options = {}) => {
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const {
    width = 400,
    height = 300,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  // Simple transformation - in production you might want more sophisticated logic
  const transformations = `w_${width},h_${height},c_${crop},q_${quality},f_${format}`;
  
  // Insert transformations into Cloudinary URL
  if (url.includes('/upload/')) {
    return url.replace('/upload/', `/upload/${transformations}/`);
  }

  return url;
};

/**
 * Get image URL from category (handles various category image formats)
 * @param {object} category - Category object
 * @returns {string} Image URL or placeholder
 */
export const getCategoryImageUrl = (category) => {
  if (!category) {
    return '/placeholder-product.svg';
  }

  // Check if category has direct image URL (string)
  if (category.image && typeof category.image === 'string') {
    return category.image;
  }

  // Check if category has image object with url property
  if (category.image && typeof category.image === 'object' && category.image.url) {
    return category.image.url;
  }

  // Check if category has imageUrl property
  if (category.imageUrl) {
    return category.imageUrl;
  }

  // Return placeholder for no image
  return '/placeholder-product.svg';
};

/**
 * Create standardized category image data for consistent handling
 * @param {object} category - Category object
 * @returns {object} Standardized image data
 */
export const createCategoryImageData = (category) => {
  const imageUrl = getCategoryImageUrl(category);
  const categoryName = category.name?.vi || category.name?.en || category.name || 'Category';
  
  return {
    url: imageUrl,
    alt: categoryName,
    hasImage: imageUrl !== '/placeholder-product.svg'
  };
};
