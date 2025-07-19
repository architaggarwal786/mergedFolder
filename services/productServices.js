/**
 * Product service
 * Handles business logic for product-related operations
 */

const Product = require('../models/Product');
const fieldMappings = require('../utils/fieldMappings');
const logger = require('../utils/logger');
const config = require('../config');

/**
 * Maps common field names to database field names
 * @param {Object} params - The search parameters with common field names
 * @returns {Object} - The mapped parameters with database field names
 */
const mapFieldNames = (params) => {
  const mappedParams = { ...params };
  
  for (const [commonField, dbField] of Object.entries(fieldMappings)) {
    if (mappedParams[commonField]) {
      mappedParams[dbField] = mappedParams[commonField];
      delete mappedParams[commonField];
    }
  }
  
  return mappedParams;
};

/**
 * Converts string fields to case-insensitive regex queries
 * @param {Object} params - The search parameters
 * @returns {Object} - The parameters with string fields converted to regex
 */
const applyStringFieldsRegex = (params) => {
  const stringFields = [
    'baseColour', 'gender', 'articleType', 'usage', 
    'season', 'subCategory', 'masterCategory'
  ];
  
  const regexParams = { ...params };
  
  for (const field of stringFields) {
    if (regexParams[field] && typeof regexParams[field] === 'string') {
      regexParams[field] = { $regex: regexParams[field], $options: 'i' };
    }
  }
  
  return regexParams;
};

/**
 * Finds products based on search parameters
 * @param {Object} searchParams - The search parameters
 * @param {Object} options - Additional options (pagination, etc.)
 * @returns {Promise<Object>} - The search results
 */
exports.findProducts = async (searchParams, options = {}) => {
  try {
    // Set default options
    const page = options.page || 1;
    const limit = options.limit || config.queryLimit;
    const skip = (page - 1) * limit;
    
    // Map common field names to database field names
    const mappedParams = mapFieldNames(searchParams);
    logger.debug('Mapped search parameters:', mappedParams);
    
    // Apply case-insensitive search for string fields
    const mongoFilter = applyStringFieldsRegex(mappedParams);
    logger.debug('Final MongoDB filter:', mongoFilter);
    
    // Execute query with pagination
    const products = await Product.find(mongoFilter)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Product.countDocuments(mongoFilter);
    
    return {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    logger.error('Error finding products:', error);
    throw error;
  }
};

/**
 * Gets a product by ID
 * @param {Number} productId - The product ID
 * @returns {Promise<Object>} - The product
 */
exports.getProductById = async (productId) => {
  try {
    const product = await Product.findOne({ id: productId });
    return product;
  } catch (error) {
    logger.error(`Error getting product with ID ${productId}:`, error);
    throw error;
  }
};

/**
 * Gets distinct values for a field
 * @param {String} field - The field to get distinct values for
 * @returns {Promise<Array>} - The distinct values
 */
exports.getDistinctValues = async (field) => {
  try {
    const values = await Product.distinct(field);
    return values;
  } catch (error) {
    logger.error(`Error getting distinct values for ${field}:`, error);
    throw error;
  }
};

// Export utility functions for testing
exports.mapFieldNames = mapFieldNames;
exports.applyStringFieldsRegex = applyStringFieldsRegex;