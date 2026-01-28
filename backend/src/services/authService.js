const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const crypto = require('crypto');
const { AppError } = require('../middlewares/errorMiddleware');

const prisma = new PrismaClient();

const signToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '1d'
    });
};

// --- OTP Service ---

exports.sendOtp = async (contact) => {
    // 1. Generate OTP
    const otp = otpGenerator.generate(6, {
        digits: true,
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false
    });

    // 2. Hash OTP
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 Minutes

    // 3. Store in DB
    // Invalidate previous OTPs for this contact
    await prisma.otpSession.deleteMany({
        where: { contact }
    });

    await prisma.otpSession.create({
        data: {
            contact,
            otp: otpHash,
            expiresAt
        }
    });

    // 4. Send OTP (Mock for now, integrate Nodemailer/SMS later)
    console.log(`\n=== OTP GENERATED FOR ${contact} ===\nCODE: ${otp}\n==================================\n`);

    // TODO: Send via Email/SMS
    return { message: 'OTP sent successfully' };
};

exports.verifyOtp = async (contact, otp, role = 'PATIENT') => {
    // 1. Find Session
    const session = await prisma.otpSession.findFirst({
        where: { contact },
        orderBy: { createdAt: 'desc' }
    });

    if (!session) {
        throw new AppError('OTP expired or not found', 400);
    }

    if (session.expiresAt < new Date()) {
        throw new AppError('OTP expired', 400);
    }

    // 2. Verify Hash
    const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
    if (session.otp !== otpHash) {
        // TODO: Increment invalid attempts
        throw new AppError('Invalid OTP', 400);
    }

    // 3. Find or Create User
    const isEmail = contact.includes('@');
    let user;

    // Dynamic query based on contact type
    if (isEmail) {
        user = await prisma.user.findUnique({ where: { email: contact } });
    } else {
        // Check phone if we had a unique phone constraint, but schema shows phone is optional and not unique in User model currently?
        // Wait, User model: email String @unique. Phone is optional.
        // If checking by phone, we need to find user with that phone.
        user = await prisma.user.findFirst({ where: { phone: contact } });
    }

    if (!user) {
        // Auto-Register
        const newUserPayload = {
            email: isEmail ? contact : `${contact}@placeholder.com`, // Temp email for phone users
            phone: isEmail ? null : contact,
            password: null, // OTP user
            role: role,
            fullName: null // Will be updated in profile set up
        };

        user = await prisma.user.create({
            data: newUserPayload
        });

        // Initialize Profile
        if (role === 'PATIENT') {
            await prisma.patientProfile.create({ data: { userId: user.id } });
        } else if (role === 'PRACTITIONER') {
            await prisma.practitionerProfile.create({
                data: {
                    userId: user.id,
                    licenseNumber: `PENDING-${Date.now()}`,
                    experience: 0,
                    consultationFee: 0,
                    isAvailable: false
                }
            });
        }
    }

    // 4. Generate Token
    const token = signToken(user.id, user.role);

    // Clean up used OTP (optional, or keep for audit logs)
    await prisma.otpSession.delete({ where: { id: session.id } });

    user.password = undefined;
    return { user, token };
};

// --- Google Auth (Placeholder) ---
exports.googleLogin = async (idToken, role = 'PATIENT') => {
    // Verify token with Google (skip for now, trust incoming email match for prototype)
    // REAL IMPLEMENTATION: const ticket = client.verifyIdToken(...)
    // const payload = ticket.getPayload();
    // const email = payload.email;

    // For now, mock it: Expect idToken to be the email for testing purposes or implement dummy verify
    const email = idToken; // MOCK

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                role,
                password: null
            }
        });
        if (role === 'PATIENT') await prisma.patientProfile.create({ data: { userId: user.id } });
        else await prisma.practitionerProfile.create({
            data: { userId: user.id, licenseNumber: `PENDING-${Date.now()}`, experience: 0, consultationFee: 0 }
        });
    }

    const token = signToken(user.id, user.role);
    user.password = undefined;
    return { user, token };
};

// --- Old methods (kept for backward compatibility if needed) ---
exports.register = async (userData) => {
    const { email, password, fullName, role, phone } = userData;
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) throw new AppError('Email already in use', 400);

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await prisma.user.create({
        data: { email, password: hashedPassword, fullName, role: role || 'PATIENT', phone }
    });

    if (newUser.role === 'PATIENT') await prisma.patientProfile.create({ data: { userId: newUser.id } });
    else await prisma.practitionerProfile.create({
        data: { userId: newUser.id, licenseNumber: `TMP-${Math.floor(Math.random() * 10000)}`, experience: 0, consultationFee: 0 }
    });

    newUser.password = undefined;
    return newUser;
};

exports.login = async (email, password) => {
    if (!email || !password) throw new AppError('Please provide email and password', 400);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
        throw new AppError('Incorrect email or password', 401);
    }
    const token = signToken(user.id, user.role);
    user.password = undefined;
    return { user, token };
};

exports.getProfile = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { patientProfile: true, practitionerProfile: true }
    });
    if (!user) throw new AppError('User not found', 404);
    user.password = undefined;
    return user;
};
