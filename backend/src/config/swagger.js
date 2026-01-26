const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'AYUSHCare API Documentation',
            version: '1.0.0',
            description: 'Enterprise-grade REST API for AYUSHCare Platform',
            contact: {
                name: 'AYUSHCare Support',
                email: 'support@ayushcare.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development Server',
            },
            {
                url: 'https://api.ayushcare.com/v1',
                description: 'Production Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Files containing annotations
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
