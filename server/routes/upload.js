const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');

// Ensure uploads dir exists
const ensureDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

// Storage — images go to uploads/images/, audio to uploads/audio/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isAudio = file.mimetype.startsWith('audio/');
    const subDir = isAudio ? 'audio' : 'images';
    const dir = path.join(__dirname, '../uploads', subDir);
    ensureDir(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/mp4', 'audio/aac'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('نوع الملف غير مدعوم'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

// POST /api/upload — upload image or audio (admin only)
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'لم يتم اختيار ملف' });

    const isAudio = req.file.mimetype.startsWith('audio/');
    const url = isAudio
      ? `/uploads/audio/${req.file.filename}`
      : `/uploads/images/${req.file.filename}`;

    // Optional: convert image to WebP using sharp (if available)
    if (!isAudio) {
      try {
        const sharp = require('sharp');
        const inputPath = req.file.path;
        const webpName = req.file.filename.replace(/\.[^.]+$/, '.webp');
        const webpPath = `uploads/images/${webpName}`;
        await sharp(inputPath).webp({ quality: 82 }).toFile(webpPath);
        fs.unlink(inputPath, () => {}); // Remove original
        return res.json({ url: `/uploads/images/${webpName}`, type: 'image' });
      } catch (e) {
        // sharp not available or failed, return original
      }
    }

    res.json({ url, type: isAudio ? 'audio' : 'image' });
  } catch (err) {
    console.error('UPLOAD ERROR:', err.message);
    res.status(500).json({ msg: err.message || 'فشل رفع الملف' });
  }
});

module.exports = router;
