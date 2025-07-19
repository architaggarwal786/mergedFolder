const mongoose = require('mongoose');
const logger = require('../utils/logger');

const productSchema = new mongoose.Schema({
  id: { 
    type: Number, 
    required: true, 
    unique: true,
    index: true 
  },
  gender: { 
    type: String, 
    required: true,
    index: true 
  },
  masterCategory: { 
    type: String, 
    required: true,
    index: true 
  },
  subCategory: { 
    type: String, 
    required: true 
  },
  articleType: { 
    type: String, 
    required: true,
    index: true 
  },
  baseColour: { 
    type: String, 
    required: true,
    index: true 
  },
  season: { 
    type: String, 
    required: true 
  },
  link: { 
    type: String, 
    required: true 
  },
  usage: { 
    type: String, 
    required: true 
  },
  productDisplayName: { 
    type: String, 
    required: true 
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create compound indexes for common query combinations
productSchema.index({ articleType: 1, baseColour: 1 });
productSchema.index({ gender: 1, articleType: 1 });
productSchema.index({ masterCategory: 1, subCategory: 1 });

// Log index creation in development
if (process.env.NODE_ENV === 'development') {
  productSchema.on('index', error => {
    if (error) {
      logger.error('Product schema indexing error:', error);
    } else {
      logger.info('Product schema indexes created successfully');
    }
  });
}

module.exports = mongoose.model('Product', productSchema, 'clothes');
// 'clothes' is the exact collection name from your DB
