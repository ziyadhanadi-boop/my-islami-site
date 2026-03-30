const express = require('express');
const router = express.Router();
const FatwaArchive = require('../models/FatwaArchive');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { isHidden: { $ne: true } };
    const items = await FatwaArchive.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const newItem = new FatwaArchive(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await FatwaArchive.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await FatwaArchive.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;