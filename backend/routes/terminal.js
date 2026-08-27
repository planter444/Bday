const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getTerminalLines,
  updateTerminalLine,
  createTerminalLine,
  deleteTerminalLine,
  reorderTerminalLines
} = require('../controllers/terminalController');

// Public routes
router.get('/lines', getTerminalLines);

// Protected routes
router.post('/lines', authMiddleware, createTerminalLine);
router.put('/lines/:id', authMiddleware, updateTerminalLine);
router.delete('/lines/:id', authMiddleware, deleteTerminalLine);
router.put('/lines/reorder', authMiddleware, reorderTerminalLines);

module.exports = router;
