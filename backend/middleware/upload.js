const multer = require('multer');
const { memoryStorage } = multer;

// Store files in memory for Supabase upload
const storage = memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  }
});

module.exports = upload;
