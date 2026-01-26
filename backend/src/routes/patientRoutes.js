const express = require('express');
const patientController = require('../controllers/patientController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);
router.use(restrictTo('PATIENT'));

router
    .route('/me')
    .get(patientController.getMyProfile)
    .patch(patientController.updateProfile);

router.post('/symptoms', patientController.logSymptom);

module.exports = router;
