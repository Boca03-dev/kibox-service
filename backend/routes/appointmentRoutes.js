const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus, getUserAppointments, markSeenByUser } = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', createAppointment);
router.get('/', protect, adminOnly, getAppointments);
router.put('/:id', protect, adminOnly, updateAppointmentStatus);
router.get('/my', protect, getUserAppointments);
router.put('/seen', protect, markSeenByUser);

module.exports = router;