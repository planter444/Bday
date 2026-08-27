const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getSceneSettings, updateSceneSetting } = require('../controllers/sceneController');

// Public routes
router.get('/', getSceneSettings);

// Protected routes
router.put('/', authMiddleware, updateSceneSetting);

module.exports = router;
