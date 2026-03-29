const { PrismaClient } = require('@prisma/client');
const os = require('os');

const prisma = new PrismaClient();

/**
 * GET /health
 * Returns server health, DB connectivity, and system info.
 */
exports.getHealth = async (req, res) => {
    let dbStatus = 'connected';
    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch {
        dbStatus = 'disconnected';
    }

    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
        environment: process.env.NODE_ENV || 'development',
        database: dbStatus,
        system: {
            platform: os.platform(),
            nodeVersion: process.version,
            memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024)
        }
    });
};
