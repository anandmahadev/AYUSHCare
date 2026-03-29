const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const reminderCtrl = require('../controllers/reminderController');

router.use(protect);

router.route('/')
    .get(reminderCtrl.getMyReminders)
    .post(reminderCtrl.createReminder);

router.delete('/:id', reminderCtrl.deleteReminder);

module.exports = router;
