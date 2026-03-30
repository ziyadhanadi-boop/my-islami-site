const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const auth = require('../middleware/auth');

// GET all media
router.get('/', async (req, res) => {
  try {
    const { type, category, admin } = req.query;
    let filter = admin === 'true' ? {} : { isHidden: { $ne: true } };
    if (type) filter.type = type;
    if (category) filter.category = category;

    const mediaList = await Media.find(filter).sort({ createdAt: -1 });
    res.json(mediaList);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST new media
router.post('/', auth, async (req, res) => {
  try {
    const { title, url, type, category, description, isHidden } = req.body;
    const newMedia = new Media({ title, url, type, category, description, isHidden });
    const media = await newMedia.save();
    res.json(media);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT update media
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, url, type, category, description, isHidden } = req.body;
    let media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ msg: 'Media not found' });

    if (title) media.title = title;
    if (url) media.url = url;
    if (type) media.type = type;
    if (category) media.category = category;
    if (description !== undefined) media.description = description;
    if (isHidden !== undefined) media.isHidden = isHidden;

    await media.save();
    res.json(media);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE media
router.delete('/:id', auth, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ msg: 'Media not found' });
    await Media.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Media removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
