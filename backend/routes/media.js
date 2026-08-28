const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');
const {
  getMemories,
  uploadPhoto,
  deletePhoto,
  updatePhoto,
  reorderPhotos,
  getMusic,
  uploadMusic,
  updateMusic,
  deleteMusic,
  getVideos,
  uploadVideo,
  deleteVideo
} = require('../controllers/mediaController');

// Public routes
router.get('/memories', getMemories);
router.get('/music', getMusic);
router.get('/videos', getVideos);

// Protected routes - require authentication
router.post('/photos', authMiddleware, upload.single('file'), uploadPhoto);
router.delete('/photos/:id', authMiddleware, deletePhoto);
router.put('/photos/:id', authMiddleware, updatePhoto);
router.put('/photos/reorder', authMiddleware, reorderPhotos);

router.post('/music', authMiddleware, upload.single('file'), uploadMusic);
router.put('/music', authMiddleware, updateMusic);
router.delete('/music', authMiddleware, deleteMusic);

router.post('/videos', authMiddleware, upload.single('file'), uploadVideo);
router.delete('/videos/:id', authMiddleware, deleteVideo);

module.exports = router;
