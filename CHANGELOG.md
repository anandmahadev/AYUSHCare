# Changelog

All notable changes to **AYUSHCare** are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- `pagination.js` utility for Prisma-compatible skip/take pagination
- `healthController.js` with DB connectivity check and system metrics
- `reminderController.js` with full CRUD for patient reminders
- `reminderRoutes.js` Express router for reminder endpoints
- `patients.css` stylesheet with hero, filter bar, and card grid
- `CHANGELOG.md` to track project evolution

### Changed
- `practitionerController.js`: added name-based search filtering
- `appointmentController.js`: added `cancelAppointment` endpoint
- `prescriptionController.js`: added `deletePrescription` endpoint
- `patientController.js`: added `getSymptomLogs` endpoint

### Fixed
- Typo in `patientController.js`: `sypmtom` → `symptom` field name

---

## [0.2.0] - 2026-03-20

### Added
- Swagger/OpenAPI documentation at `/api-docs`
- Winston logger with file + console transports
- Mock API system for demo mode (no backend required)
- Role-based access control for prescriptions

### Changed
- Rate limiter moved from 200 → 100 requests per 15 min window

---

## [0.1.0] - 2026-03-14

### Added
- Initial project scaffold with Express, Prisma, JWT auth
- `authController`, `patientController`, `practitionerController`
- `appointmentController`, `prescriptionController`
- Frontend pages: index, dashboard, patients, practitioners, specialities, technology, contact
