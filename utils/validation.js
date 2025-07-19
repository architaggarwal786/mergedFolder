/**
 * Validation utilities for API requests
 */

/**
 * Validates search parameters against a list of valid fields
 * @param {Object} params - The search parameters to validate
 * @returns {Array|null} - Array of error messages or null if valid
 */
const validateSearchParams = (params) => {
  const validFields = ['type', 'color', 'gender', 'usage', 'season', 'category', 'subcategory'];
  const errors = [];
  
  if (!params || typeof params !== 'object') {
    return ['Invalid search parameters format'];
  }
  
  Object.keys(params).forEach(key => {
    if (!validFields.includes(key)) {
      errors.push(`Invalid search field: ${key}`);
    }
  });
  
  return errors.length ? errors : null;
};

module.exports = {
  validateSearchParams
};