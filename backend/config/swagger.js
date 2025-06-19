import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.1.0',
    info: {
      title: 'TEST-QUALITY REST API',
      version: '1.0.0',
    },
  },
  apis: ['./backend/routes/*.js']
});
