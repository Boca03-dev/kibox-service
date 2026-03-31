const Chat = require('../models/Chat');
const User = require('../models/User');
const { createNotification } = require('./notificationController');

exports.getOrCreateChat = async (req, res) => {
  try {
    let chat = await Chat.findOne({ user: req.user.id })
      .populate('messages.sender', 'name role');
    
    if (!chat) {
      chat = await Chat.create({ user: req.user.id, messages: [] });
      chat = await Chat.findById(chat._id).populate('messages.sender', 'name role');
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find()
      .populate('user', 'name email')
      .sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('messages.sender', 'name role')
      .populate('user', 'name email');
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, content } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { messages: { sender: req.user.id, content } } },
      { new: true }
    ).populate('messages.sender', 'name role')
     .populate('user', 'name email');

    const isAdmin = req.user.role === 'admin';

    if (isAdmin) {
      await createNotification(
        chat.user._id,
        'message',
        'Nova poruka od admina',
        `Admin: ${content.substring(0, 50)}`,
        '/chat'
      );
    } else {
      const admin = await User.findOne({ role: 'admin' });
      if (admin) {
        await createNotification(
          admin._id,
          'message',
          `Nova poruka od ${req.user.name}`,
          content.substring(0, 50),
          `/admin/chat/${chatId}`
        );
      }
    }

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkChatExists = async (req, res) => {
  try {
    const chat = await Chat.findOne({ user: req.user.id });
    res.json({ exists: !!chat, chatId: chat?._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};