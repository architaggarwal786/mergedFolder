 // middleware/swagger.js
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');

const swaggerServe = swaggerUi.serve;
const swaggerSetup = swaggerUi.setup(swaggerDocument);

module.exports = { swaggerServe, swaggerSetup };
