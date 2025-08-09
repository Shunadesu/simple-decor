const crypto = require('crypto');

/**
 * Generate a unique guest ID
 * @returns {string} A unique guest ID
 */
const generateGuestId = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Validate guest ID format
 * @param {string} guestId - The guest ID to validate
 * @returns {boolean} True if valid, false otherwise
 */
const isValidGuestId = (guestId) => {
  if (!guestId || typeof guestId !== 'string') {
    return false;
  }
  // Guest ID should be 32 characters (16 bytes in hex)
  return /^[a-f0-9]{32}$/.test(guestId);
};

/**
 * Create a guest session
 * @returns {object} Guest session object
 */
const createGuestSession = () => {
  const guestId = generateGuestId();
  const createdAt = new Date();
  
  return {
    guestId,
    createdAt,
    expiresAt: new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
  };
};

module.exports = {
  generateGuestId,
  isValidGuestId,
  createGuestSession
}; 