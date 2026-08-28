const express = require('express');
const router = express.Router();
const {
  getMemoryPages,
  getMemoryPage,
  createMemoryPage,
  createMemoryPageWithFiles,
  updateMemoryPage,
  deleteMemoryPage,
  reorderMemoryPages,
  uploadMemoryPhoto,
  uploadMemoryBackground,
  uploadMemoryMusic,
  setMemoryMusicUrl
} = require('../controllers/memoryController');
const auth = require('../middleware/auth');
const { upload, uploadMultiple } = require('../middleware/upload');

// Public routes (for the birthday experience)
router.get('/', getMemoryPages);
router.get('/:id', getMemoryPage);

// Admin routes (require authentication)
router.post('/', auth, createMemoryPage);
router.post('/with-files', auth, uploadMultiple.fields([{ name: 'photo' }, { name: 'music' }]), createMemoryPageWithFiles);
router.put('/:id', auth, updateMemoryPage);
router.delete('/:id', auth, deleteMemoryPage);
router.put('/reorder', auth, reorderMemoryPages);

// Upload routes
router.post('/:memoryId/photo', auth, upload.single('file'), uploadMemoryPhoto);
router.post('/:memoryId/background', auth, upload.single('file'), uploadMemoryBackground);
router.post('/:memoryId/music', auth, upload.single('file'), uploadMemoryMusic);
router.post('/:memoryId/music-url', auth, setMemoryMusicUrl);

module.exports = router;
