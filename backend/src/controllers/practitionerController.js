const { PrismaClient } = require('@prisma/client');
const { AppError } = require('../middlewares/errorMiddleware');

const prisma = new PrismaClient();

// Get filtered practitioners (public)
exports.getAllPractitioners = async (req, res, next) => {
    try {
        const { speciality, search } = req.query;

        // Build filter
        const where = {
            isAvailable: true
        };

        if (speciality) {
            where.specialities = {
                has: speciality
            };
        }

        // Basic search filtering logic would go here
        // Prisma text search or reliable 'contains' depends on DB config

        const practitioners = await prisma.practitionerProfile.findMany({
            where,
            include: {
                user: {
                    select: { fullName: true, email: true }
                }
            }
        });

        res.status(200).json({
            status: 'success',
            results: practitioners.length,
            data: { practitioners }
        });
    } catch (error) {
        next(error);
    }
};

// Update my profile (Practitioner only)
exports.updateProfile = async (req, res, next) => {
    try {
        const { specialities, bio, experience, consultationFee, availability } = req.body;

        const profile = await prisma.practitionerProfile.update({
            where: { userId: req.user.id },
            data: {
                specialities, // Array of Enums
                bio,
                experience: Number(experience),
                consultationFee: Number(consultationFee),
                availability // JSON object
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

// Get single practitioner
exports.getPractitioner = async (req, res, next) => {
    try {
        const profile = await prisma.practitionerProfile.findUnique({
            where: { id: req.params.id },
            include: {
                user: { select: { fullName: true } }
            }
        });

        if (!profile) {
            return next(new AppError('Practitioner not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: { profile }
        });
    } catch (error) {
        next(error);
    }
};
