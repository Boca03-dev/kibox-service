const express = require('express');
const router = express.Router();
const { getComponents, createComponent, deleteComponent } = require('../controllers/componentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getComponents);
router.post('/', protect, adminOnly, createComponent);
router.delete('/:id', protect, adminOnly, deleteComponent);

module.exports = router;