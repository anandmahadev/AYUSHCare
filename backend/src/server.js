require('dotenv').config();
const app = require('./app');
const { PrismaClient } = require('@prisma/client');
const logger = require('./utils/logger');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Database Connection Check
async function checkDatabaseConnection() {
    try {
        await prisma.$connect();
        logger.info('✅ Database connected successfully');
    } catch (error) {
        logger.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

// Start Server
const server = app.listen(PORT, async () => {
    await checkDatabaseConnection();
    logger.info(`🚀 AYUSHCare Backend running on port ${PORT}`);
    logger.info(`📚 Swagger Docs available at http://localhost:${PORT}/api-docs`);
});

// Graceful Shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received. Shutting down gracefully');
    await prisma.$disconnect();
    server.close(() => {
        logger.info('Process terminated');
    });
});
