// config.js
require('dotenv').config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  environment: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY,
  qwemApiKey: process.env.QWEN_API_KEY || '',
  queryLimit: parseInt(process.env.QUERY_LIMIT) || 10,
  enableCaching: process.env.ENABLE_CACHING === 'true' || false,
  cacheExpiration: parseInt(process.env.CACHE_EXPIRATION) || 300,
};
