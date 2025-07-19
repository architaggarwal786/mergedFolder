/**
 * Product controller
 * Handles HTTP requests for product-related operations
 */

const productService = require('../services/productServices');
const { validateSearchParams } = require('../utils/validation');
const logger = require('../utils/logger');

/**
 * Search for products based on query parameters
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.searchProducts = async (req, res) => {
  try {
    const searchParams = req.body;
    logger.info('Received search request with params:', searchParams);
    
    // Validate search parameters
    const errors = validateSearchParams(searchParams);
    if (errors) {
      logger.warn('Invalid search parameters:', errors);
      return res.status(400).json({ errors });
    }
    
    // Get pagination options from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    // Find products using service
    const result = await productService.findProducts(searchParams, { page, limit });
    
    logger.info(`Found ${result.pagination.total} products matching criteria`);
    res.json(result);
  } catch (error) {
    logger.error('Error in searchProducts controller:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while processing your request'
    });
  }
};

/**
 * Get a product by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProductById = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    if (isNaN(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    const product = await productService.getProductById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    logger.error('Error in getProductById controller:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while processing your request'
    });
  }
};

/**
 * Get distinct values for a field
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getDistinctValues = async (req, res) => {
  try {
    const field = req.params.field;
    
    // Validate field name
    const validFields = ['articleType', 'baseColour', 'gender', 'usage', 'season', 'masterCategory', 'subCategory'];
    if (!validFields.includes(field)) {
      return res.status(400).json({ error: `Invalid field: ${field}` });
    }
    
    const values = await productService.getDistinctValues(field);
    res.json(values);
  } catch (error) {
    logger.error('Error in getDistinctValues controller:', error);
    res.status(500).json({ 
      error: 'Server error', 
      message: process.env.NODE_ENV === 'development' ? error.message : 'An error occurred while processing your request'
    });
  }
};