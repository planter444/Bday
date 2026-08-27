const express = require('express');
const router = express.Router();
const { getConfig, updateConfig, getTheme, updateTheme } = require('../controllers/configController');
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', getConfig);
router.get('/theme', getTheme);

// Protected routes
router.put('/', authMiddleware, updateConfig);
router.put('/theme', authMiddleware, updateTheme);

module.exports = router;
