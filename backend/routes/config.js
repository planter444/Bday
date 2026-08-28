const express = require('express');
const router = express.Router();
const { getConfig, updateConfig, getTheme, updateTheme, updateSceneMusic, uploadSceneMusic } = require('../controllers/configController');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Public routes
router.get('/', getConfig);
router.get('/theme', getTheme);

// Protected routes
router.put('/', auth, updateConfig);
router.put('/theme', auth, updateTheme);
router.put('/scene-music', auth, updateSceneMusic);
router.post('/:scene/music', auth, upload.single('file'), uploadSceneMusic);

module.exports = router;
