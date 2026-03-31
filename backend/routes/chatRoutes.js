const express = require('express');
const router = express.Router();
const { getOrCreateChat, getAllChats, getChatById, sendMessage, checkChatExists } = require('../controllers/chatController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/my', protect, getOrCreateChat);
router.get('/', protect, adminOnly, getAllChats);
router.get('/exists', protect, checkChatExists);
router.get('/:id', protect, adminOnly, getChatById);
router.post('/message', protect, sendMessage);

module.exports = router;