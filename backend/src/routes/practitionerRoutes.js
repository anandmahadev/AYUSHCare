const express = require('express');
const practitionerController = require('../controllers/practitionerController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

router
    .route('/')
    .get(practitionerController.getAllPractitioners);

router
    .route('/profile')
    .patch(
        protect,
        restrictTo('PRACTITIONER', 'ADMIN'),
        practitionerController.updateProfile
    );

router
    .route('/:id')
    .get(practitionerController.getPractitioner);

module.exports = router;
