const Notification = require('../models/Notifications');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ recipient: req.user.id, read: false }, { read: true });
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createNotification = async (recipientId, type, title, body, link = '') => {
  try {
    await Notification.create({ recipient: recipientId, type, title, body, link });
  } catch (err) {
    console.log('Notification error:', err.message);
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user.id });
    res.json({ message: 'Obrisano' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAllRead = async (req, res) => {
  try {
    await Notification.deleteMany({ recipient: req.user.id, read: true });
    res.json({ message: 'Obrisano' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};