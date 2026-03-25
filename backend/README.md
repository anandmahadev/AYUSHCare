# AYUSHCare Backend API

Enterprise-grade RESTful API for the AYUSHCare platform, built with Node.js, Express, and PostgreSQL (Prisma).

## Project Overview
AYUSHCare is an integrated healthcare platform designed to streamline the interaction between practitioners and patients using modern web technologies. Our goal is to provide a secure, scalable, and intuitive system for managing appointments, patient records, and practitioners' profiles.

## Tech Stack
- **Backend**: Node.js, Express.js (RESTful API)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens) with Bcrypt password hashing
- **Frontend**: Next.js (planned/ongoing)
- **Styling**: Vanilla CSS with modern design patterns
- **Documentation**: Swagger/OpenAPI 3.0

## Setup & Installation

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   - Create `.env` file (copy from `.env.example`)
   - Update `DATABASE_URL` for your local PostgreSQL instance

3. **Database Setup**
   ```bash
   # Run migrations
   npx prisma migrate dev --name init
   
   # Seed database
   npm run seed
   ```

4. **Run Server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Documentation

Access the full Swagger documentation at:
`http://localhost:3000/api-docs`

### System Health
Monitor service status and telemetry:
`GET /health` - Returns uptime, environment, and current timestamp.

## Core Endpoints

### Auth
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login & get Token
- `GET /api/auth/me` - Get current user profile

### Practitioners
- `GET /api/practitioners` - List all (with filters)
- `GET /api/practitioners/:id` - Get details
- `PATCH /api/practitioners/profile` - Update profile

### Patients
- `GET /api/patients/me` - Get full medical profile
- `POST /api/patients/symptoms` - Log daily symptoms

### Appointments
- `POST /api/appointments` - Book appointment
- `GET /api/appointments` - List my appointments

## Database Schema
The database is fully normalized with separate tables for `Users`, `PractitionerProfiles`, `PatientProfiles`, `Appointments`, and `Prescriptions`.

## Security Features
- Helmet for HTTP headers
- Rate Limiting enabled
- CORS configured
- Password Hashing (Bcrypt)
- JWT Authentication
