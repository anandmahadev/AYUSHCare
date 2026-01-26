const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middlewares/errorMiddleware');

const prisma = new PrismaClient();

exports.getMyProfile = async (req, res, next) => {
    try {
        const profile = await prisma.patientProfile.findUnique({
            where: { userId: req.user.id },
            include: {
                appointments: true,
                prescriptions: true,
                reminders: true
            }
        });

        res.status(200).json({
            status: 'success',
            data: { profile }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const {
            dateOfBirth, gender, bloodGroup, address,
            constitutionType, dietaryPreference, lifestyleNotes, allergies, medicalHistory
        } = req.body;

        const profile = await prisma.patientProfile.update({
            where: { userId: req.user.id },
            data: {
                dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
                gender, bloodGroup, address,
                constitutionType, dietaryPreference, lifestyleNotes, allergies,
                medicalHistory
            }
        });

        res.status(200).json({
            status: 'success',
            data: { profile }
        });
    } catch (error) {
        next(error);
    }
};

// Log a symptom
exports.logSymptom = async (req, res, next) => {
    try {
        const { symptom, severity, notes } = req.body;

        // Get patient ID
        const patientHandler = await prisma.patientProfile.findUnique({
            where: { userId: req.user.id }
        });

        const log = await prisma.symptomLog.create({
            data: {
                patientId: patientHandler.id,
                sypmtom: symptom,
                severity: Number(severity),
                notes
            }
        });

        res.status(201).json({
            status: 'success',
            data: { log }
        });
    } catch (error) {
        next(error);
    }
};
