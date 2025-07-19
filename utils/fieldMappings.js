/**
 * Field mappings between common query terms and database field names
 * This centralizes the mapping logic for reuse across the application
 */

const fieldMappings = {
  'type': 'articleType',
  'color': 'baseColour',
  'category': 'masterCategory',
  'subcategory': 'subCategory'
};

module.exports = fieldMappings;