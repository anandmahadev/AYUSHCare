// cronService.js - Placeholder for background jobs
const cron = require('node-cron');
const logger = require('../utils/logger');
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

const initCronJobs = () => {
    // Run every morning at 8 AM
    cron.schedule('0 8 * * *', async () => {
        logger.info('Running daily reminder checks...');
        
        try {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);

            const upcomingReminders = await prisma.reminder.findMany({
                where: {
                    remindAt: {
                        gte: today,
                        lt: tomorrow
                    },
                    status: 'PENDING'
                },
                include: {
                    patient: {
                        include: {
                            user: { select: { fullName: true, email: true } }
                        }
                    }
                }
            });

            logger.info(`Found ${upcomingReminders.length} upcoming reminders for today.`);
            
            // Logic to send notification/email would go here...
            for (const r of upcomingReminders) {
                logger.info(`Reminder: ${r.title} for ${r.patient.user.fullName}`);
            }

        } catch (error) {
            logger.error('Error in cron task:', error);
        }
    });

    logger.info('⏰ Cron jobs initialized');
};

module.exports = initCronJobs;
