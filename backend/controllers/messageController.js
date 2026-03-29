const Message = require('../models/Message');
const { createNotification } = require('./notificationController');
const User = require('../models/User');

exports.createMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);

    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await createNotification(
        admin._id,
        'message',
        'Nova poruka',
        `${req.body.name}: ${req.body.message.substring(0, 50)}...`,
        '/admin/messages'
      );
    }

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    res.json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};