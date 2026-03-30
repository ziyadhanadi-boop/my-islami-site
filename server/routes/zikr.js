const express = require('express');
const router = express.Router();
const Zikr = require('../models/Zikr');
const auth = require('../middleware/auth');

// GET all active zikr
router.get('/', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { isHidden: { $ne: true } };
    const zikrs = await Zikr.find(filter).sort({ createdAt: -1 });
    res.json(zikrs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET all for admin
router.get('/admin/all', auth, async (req, res) => {
  try {
    const zikrs = await Zikr.find().sort({ createdAt: -1 });
    res.json(zikrs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST new zikr
router.post('/', auth, async (req, res) => {
  try {
    const { text, count, description, category, isHidden } = req.body;
    const newZikr = new Zikr({ text, count, description, category, isHidden });
    const zikr = await newZikr.save();
    res.json(zikr);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT update zikr
router.put('/:id', auth, async (req, res) => {
  try {
    const { text, count, description, category, isHidden } = req.body;
    let zikr = await Zikr.findById(req.params.id);
    if (!zikr) return res.status(404).json({ msg: 'Zikr not found' });

    if (text) zikr.text = text;
    if (count !== undefined) zikr.count = count;
    if (description !== undefined) zikr.description = description;
    if (category) zikr.category = category;
    if (isHidden !== undefined) zikr.isHidden = isHidden;

    await zikr.save();
    res.json(zikr);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE zikr
router.delete('/:id', auth, async (req, res) => {
  try {
    const zikr = await Zikr.findById(req.params.id);
    if (!zikr) return res.status(404).json({ msg: 'Zikr not found' });
    await Zikr.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Zikr removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
