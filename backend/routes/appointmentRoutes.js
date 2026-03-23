const express = require('express');
const router = express.Router();
const { createAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', createAppointment);
router.get('/', protect, adminOnly, getAppointments);
router.put('/:id', protect, adminOnly, updateAppointmentStatus);

module.exports = router;