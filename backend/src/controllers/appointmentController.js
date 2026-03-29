const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middlewares/errorMiddleware');

const prisma = new PrismaClient();

exports.bookAppointment = async (req, res, next) => {
    try {
        const { practitionerId, scheduledAt, reason, type } = req.body;

        // Get patient ID
        const patientHandler = await prisma.patientProfile.findUnique({
            where: { userId: req.user.id }
        });

        // Check practitioner availability (Simplistic check)
        // In real app: check practitioner.availability vs scheduledAt

        const appointment = await prisma.appointment.create({
            data: {
                practitionerId,
                patientId: patientHandler.id,
                scheduledAt: new Date(scheduledAt),
                status: 'PENDING',
                type: type || 'VIDEO',
                notes: reason,
                meetingLink: type === 'VIDEO' ? `https://meet.ayushcare.com/${Math.random().toString(36).substring(7)}` : null
            }
        });

        res.status(201).json({
            status: 'success',
            data: { appointment }
        });
    } catch (error) {
        next(error);
    }
};

exports.getMyAppointments = async (req, res, next) => {
    try {
        let where = {};

        if (req.user.role === 'PATIENT') {
            const profile = await prisma.patientProfile.findUnique({ where: { userId: req.user.id } });
            where.patientId = profile.id;
        } else if (req.user.role === 'PRACTITIONER') {
            const profile = await prisma.practitionerProfile.findUnique({ where: { userId: req.user.id } });
            where.practitionerId = profile.id;
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                patient: { include: { user: { select: { fullName: true } } } },
                practitioner: { include: { user: { select: { fullName: true } } } }
            },
            orderBy: { scheduledAt: 'asc' }
        });

        res.status(200).json({
            status: 'success',
            results: appointments.length,
            data: { appointments }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        const appointment = await prisma.appointment.update({
            where: { id },
            data: { status }
        });

        res.status(200).json({
            status: 'success',
            data: { appointment }
        });
    } catch (error) {
        next(error);
    }
};

exports.cancelAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;

        const appointment = await prisma.appointment.findUnique({ where: { id } });
        if (!appointment) {
            return next(new AppError('Appointment not found', 404));
        }

        // Only allow patient who booked or the practitioner to cancel
        const profile =
            req.user.role === 'PATIENT'
                ? await prisma.patientProfile.findUnique({ where: { userId: req.user.id } })
                : await prisma.practitionerProfile.findUnique({ where: { userId: req.user.id } });

        const isOwner =
            (req.user.role === 'PATIENT' && appointment.patientId === profile.id) ||
            (req.user.role === 'PRACTITIONER' && appointment.practitionerId === profile.id);

        if (!isOwner) {
            return next(new AppError('You are not authorized to cancel this appointment', 403));
        }

        const updated = await prisma.appointment.update({
            where: { id },
            data: { status: 'CANCELLED' }
        });

        res.status(200).json({ status: 'success', data: { appointment: updated } });
    } catch (error) {
        next(error);
    }
};
