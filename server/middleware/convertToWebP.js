/**
 * WebP Image Optimizer Middleware
 * Converts any uploaded image to WebP format using sharp
 * Deletes the original file after conversion
 */
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const convertToWebP = async (req, res, next) => {
  if (!req.file) return next(); // No file uploaded, skip

  const originalPath = req.file.path;
  const webpFilename = path.basename(req.file.filename, path.extname(req.file.filename)) + '.webp';
  const webpPath = path.join(path.dirname(originalPath), webpFilename);

  try {
    await sharp(originalPath)
      .resize(1200, 800, {
        fit: 'inside',       // Never upscale, just constrain
        withoutEnlargement: true
      })
      .webp({ quality: 82, effort: 4 }) // quality 82: great balance speed vs size
      .toFile(webpPath);

    // Delete original file to save space
    fs.unlink(originalPath, () => {});

    // Override req.file to point to the new WebP file
    req.file.filename = webpFilename;
    req.file.path = webpPath;
    req.file.mimetype = 'image/webp';

    next();
  } catch (err) {
    console.error('WebP conversion failed:', err.message);
    // On error: keep original file and continue (graceful degradation)
    next();
  }
};

module.exports = convertToWebP;
