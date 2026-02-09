const swaggerJSDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Tender Management System API',
      version: '1.0.0',
      description: 'API documentation for Tender Management System',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, indicates the token format
        },
      },
    },
    security: [
      {
        BearerAuth: [], // Apply BearerAuth globally
      },
    ],
  },
  apis: ['./src/controllers/*.js'], // Path to your controllers
};

module.exports = swaggerJSDoc(swaggerOptions);