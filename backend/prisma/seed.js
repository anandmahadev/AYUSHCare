const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Password for everyone: "password123"
    const hashedPassword = await bcrypt.hash('password123', 12);

    // 1. Create Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ayushcare.com' },
        update: {},
        create: {
            email: 'admin@ayushcare.com',
            password: hashedPassword,
            fullName: 'System Admin',
            role: 'ADMIN'
        }
    });

    // 2. Create Practitioners
    const doctorData = [
        { email: 'ayurveda@demo.com', name: 'Dr. Sharma', spec: 'AYURVEDA' },
        { email: 'yoga@demo.com', name: 'Yogi Patel', spec: 'YOGA_NATUROPATHY' },
        { email: 'homeo@demo.com', name: 'Dr. Elizabeth', spec: 'HOMEOPATHY' }
    ];

    for (const doc of doctorData) {
        const user = await prisma.user.upsert({
            where: { email: doc.email },
            update: {},
            create: {
                email: doc.email,
                password: hashedPassword,
                fullName: doc.name,
                role: 'PRACTITIONER'
            }
        });

        await prisma.practitionerProfile.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                licenseNumber: `LIC-${Math.floor(Math.random() * 90000)}`,
                specialities: [doc.spec],
                experience: 10,
                consultationFee: 500,
                bio: `Experienced ${doc.spec} practitioner specialized in holistic healing.`
            }
        });
    }

    // 3. Create Patients
    const patient = await prisma.user.upsert({
        where: { email: 'patient@demo.com' },
        update: {},
        create: {
            email: 'patient@demo.com',
            password: hashedPassword,
            fullName: 'Rajesh Kumar',
            role: 'PATIENT'
        }
    });

    await prisma.patientProfile.upsert({
        where: { userId: patient.id },
        update: {},
        create: {
            userId: patient.id,
            dateOfBirth: new Date('1985-06-15'),
            gender: 'Male',
            bloodGroup: 'O+',
            constitutionType: 'Vata-Pitta'
        }
    });

    console.log('✅ Seed data created successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
