const express = require('express');
const prescriptionController = require('../controllers/prescriptionController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

// Create prescription (Practitioner only)
router.post(
    '/',
    restrictTo('PRACTITIONER', 'ADMIN'),
    prescriptionController.createPrescription
);

// Get prescriptions for a specific patient
router.get(
    '/patient/:patientId',
    restrictTo('PATIENT', 'PRACTITIONER', 'ADMIN'),
    prescriptionController.getPatientPrescriptions
);

module.exports = router;
