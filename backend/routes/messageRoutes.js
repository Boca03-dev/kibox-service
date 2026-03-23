const express = require('express');
const router = express.Router();
const { createMessage, getMessages, markAsRead } = require('../controllers/messageController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', createMessage);
router.get('/', protect, adminOnly, getMessages);
router.put('/:id/read', protect, adminOnly, markAsRead);

module.exports = router;