const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middlewares/errorMiddleware');

const prisma = new PrismaClient();

/**
 * POST /api/reminders
 * Create a new reminder for the logged-in patient.
 */
exports.createReminder = async (req, res, next) => {
    try {
        const { title, message, remindAt, type } = req.body;

        const patient = await prisma.patientProfile.findUnique({
            where: { userId: req.user.id }
        });

        if (!patient) return next(new AppError('Patient profile not found', 404));

        const reminder = await prisma.reminder.create({
            data: {
                patientId: patient.id,
                title,
                message,
                remindAt: new Date(remindAt),
                type: type || 'MEDICATION'
            }
        });

        res.status(201).json({ status: 'success', data: { reminder } });
    } catch (error) {
        next(error);
    }
};

/**
 * GET /api/reminders
 * Fetch all reminders for the logged-in patient.
 */
exports.getMyReminders = async (req, res, next) => {
    try {
        const patient = await prisma.patientProfile.findUnique({
            where: { userId: req.user.id }
        });

        if (!patient) return next(new AppError('Patient profile not found', 404));

        const reminders = await prisma.reminder.findMany({
            where: { patientId: patient.id },
            orderBy: { remindAt: 'asc' }
        });

        res.status(200).json({
            status: 'success',
            results: reminders.length,
            data: { reminders }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * DELETE /api/reminders/:id
 * Delete a reminder (only owner can delete).
 */
exports.deleteReminder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const patient = await prisma.patientProfile.findUnique({
            where: { userId: req.user.id }
        });

        const reminder = await prisma.reminder.findUnique({ where: { id } });
        if (!reminder) return next(new AppError('Reminder not found', 404));
        if (reminder.patientId !== patient.id) {
            return next(new AppError('You are not authorized to delete this reminder', 403));
        }

        await prisma.reminder.delete({ where: { id } });
        res.status(204).json({ status: 'success', data: null });
    } catch (error) {
        next(error);
    }
};
