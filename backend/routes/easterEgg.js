const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getEasterEggConfig, updateEasterEggConfig } = require('../controllers/easterEggController');

// Public routes
router.get('/', getEasterEggConfig);

// Protected routes
router.put('/', authMiddleware, updateEasterEggConfig);

module.exports = router;
