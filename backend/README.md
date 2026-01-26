# AYUSHCare Backend API

Enterprise-grade RESTful API for the AYUSHCare platform, built with Node.js, Express, and PostgreSQL (Prisma).

## Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT & BCrypt
- **Validation**: Joi (Integrated)
- **Documentation**: Swagger UI

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
