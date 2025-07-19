const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, 'server.log');

function writeLog(level, message) {
  const log = `[${level.toUpperCase()}] ${new Date().toISOString()} - ${message}`;
  
  if (level === 'error') {
    console.error(log);
  } else if (level === 'debug') {
    if (process.env.NODE_ENV === 'development') {
      console.debug(log);
    }
  } else {
    console.log(log);
  }

  fs.appendFileSync(logFile, log + '\n');
}

const logger = {
  info: (message) => writeLog('info', message),
  error: (message, err = '') => writeLog('error', `${message} ${err}`),
  debug: (message) => writeLog('debug', message),  // ✅ This is the important fix
  warn: (message) => writeLog('warn', message),
};

module.exports = logger;
