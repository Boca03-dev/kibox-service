const express = require('express');
const router = express.Router();
const { createConfiguration, getUserConfigurations, deleteConfiguration, generateConfiguration, getAllConfigurations, sendToAdmin } = require('../controllers/configurationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');


router.post('/', protect, createConfiguration);
router.get('/my', protect, getUserConfigurations);
router.post('/generate', generateConfiguration);
router.get('/all', protect, adminOnly, getAllConfigurations);
router.delete('/:id', protect, deleteConfiguration);
router.put('/:id/send', protect, sendToAdmin);
module.exports = router;