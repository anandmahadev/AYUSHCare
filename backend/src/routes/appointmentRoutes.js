const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router
    .route('/')
    .post(restrictTo('PATIENT'), appointmentController.bookAppointment)
    .get(appointmentController.getMyAppointments);

router
    .route('/:id/status')
    .patch(restrictTo('PRACTITIONER', 'ADMIN'), appointmentController.updateStatus);

module.exports = router;
