const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { AppError } = require('../middlewares/errorMiddleware');

const prisma = new PrismaClient();

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.register = async (userData) => {
    const { email, password, fullName, role, phone } = userData;

    // Check if user exists
    const userExists = await prisma.user.findUnique({
        where: { email }
    });

    if (userExists) {
        throw new AppError('Email already in use', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create User
    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            fullName,
            role: role || 'PATIENT',
            phone
        }
    });

    // Create Profile based on Role
    if (newUser.role === 'PATIENT') {
        await prisma.patientProfile.create({
            data: { userId: newUser.id }
        });
    } else if (newUser.role === 'PRACTITIONER') {
        // Basic profile initialization
        await prisma.practitionerProfile.create({
            data: {
                userId: newUser.id,
                licenseNumber: `TMP-${Math.floor(Math.random() * 10000)}`, // Temp license logic
                experience: 0,
                consultationFee: 0
            }
        });
    }

    // Remove password from output
    newUser.password = undefined;

    return newUser;
};

exports.login = async (email, password) => {
    // Check if email and password exist
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    // Check if user exists & password is correct
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Incorrect email or password', 401);
    }

    // Generate Token
    const token = signToken(user.id, user.role);

    // Remove password
    user.password = undefined;

    return { user, token };
};

exports.getProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            patientProfile: true,
            practitionerProfile: true
        }
    });

    if (!user) {
        throw new AppError('User not found', 404);
    }

    user.password = undefined;
    return user;
};
