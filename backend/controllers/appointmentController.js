const Appointment = require('../models/Appointment');
const { createNotification } = require('./notificationController');
const User = require('../models/User');

exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);

    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await createNotification(
        admin._id,
        'appointment',
        'Novi termin',
        `${req.body.name} je zakazao termin za ${new Date(req.body.date).toLocaleDateString('sr-RS')}`,
        '/admin/appointments'
      );
    }

    res.status(201).json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    const user = await User.findOne({ email: appointment.email });
    if (user) {
      const statusText = req.body.status === 'confirmed' ? 'potvrđen ✅' : 'otkazan ❌';
      await createNotification(
        user._id,
        'appointment_status',
        'Status termina promenjen',
        `Vaš termin je ${statusText}`,
        '/my-appointments'
      );
    }

    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ email: req.user.email }).sort({ createdAt: -1 });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markSeenByUser = async (req, res) => {
  try {
    await Appointment.updateMany(
      { email: req.user.email, status: { $in: ['confirmed', 'cancelled'] } },
      { seenByUser: true }
    );
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};