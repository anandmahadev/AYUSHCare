const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middlewares/errorMiddleware');

const prisma = new PrismaClient();

exports.createPrescription = async (req, res, next) => {
    try {
        const {
            patientId,
            diagnosis,
            medicines, // JSON array
            yogaInstructions,
            dietaryAdvice,
            lifestyleAdvice,
            notes
        } = req.body;

        const practitioner = await prisma.practitionerProfile.findUnique({
            where: { userId: req.user.id }
        });

        const prescription = await prisma.prescription.create({
            data: {
                practitionerId: practitioner.id,
                patientId,
                diagnosis,
                medicines: medicines || [], // [{name: 'X', dosage: 'Y'}]
                yogaInstructions,
                dietaryAdvice,
                lifestyleAdvice,
                notes
            }
        });

        res.status(201).json({
            status: 'success',
            data: { prescription }
        });
    } catch (error) {
        next(error);
    }
};

exports.getPatientPrescriptions = async (req, res, next) => {
    try {
        const { patientId } = req.params;

        // Security check: only allow if user is that patient OR is a practitioner
        if (req.user.role === 'PATIENT') {
            const userProfile = await prisma.patientProfile.findUnique({ where: { userId: req.user.id } });
            if (userProfile.id !== patientId) {
                return next(new AppError('Unauthorized access to prescriptions', 403));
            }
        }

        const prescriptions = await prisma.prescription.findMany({
            where: { patientId },
            include: {
                practitioner: {
                    include: { user: { select: { fullName: true } } }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            status: 'success',
            results: prescriptions.length,
            data: { prescriptions }
        });
    } catch (error) {
        next(error);
    }
};
