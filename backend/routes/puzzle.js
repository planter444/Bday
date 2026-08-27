const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getPuzzleConfig, updatePuzzleConfig } = require('../controllers/puzzleController');

// Public routes
router.get('/', getPuzzleConfig);

// Protected routes
router.put('/', authMiddleware, updatePuzzleConfig);

module.exports = router;
