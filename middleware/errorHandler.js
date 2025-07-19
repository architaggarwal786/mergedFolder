 // middleware/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error('[ERROR] ❌', err.stack || err.message || err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
