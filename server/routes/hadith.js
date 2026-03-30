const express = require('express');
const router = express.Router();
const Hadith = require('../models/Hadith');
const auth = require('../middleware/auth');

// GET all active hadiths
router.get('/', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { isHidden: { $ne: true } };
    const hadiths = await Hadith.find(filter).sort({ createdAt: -1 });
    res.json(hadiths);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET a random active hadith
router.get('/random', async (req, res) => {
  try {
    const count = await Hadith.countDocuments({ isHidden: { $ne: true } });
    if (count === 0) return res.status(404).json({ msg: 'No hadiths found' });
    const random = Math.floor(Math.random() * count);
    const hadith = await Hadith.findOne({ isHidden: { $ne: true } }).skip(random);
    res.json(hadith);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// GET for admin
router.get('/admin/all', auth, async (req, res) => {
  try {
    const hadiths = await Hadith.find().sort({ createdAt: -1 });
    res.json(hadiths);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const hadith = await Hadith.findById(req.params.id);
    if (!hadith) return res.status(404).json({ msg: 'Hadith not found' });
    res.json(hadith);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST new hadith
router.post('/', auth, async (req, res) => {
  try {
    const { text, source, isHidden } = req.body;
    const newHadith = new Hadith({ text, source, isHidden });
    const hadith = await newHadith.save();
    res.json(hadith);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT update hadith
router.put('/:id', auth, async (req, res) => {
  try {
    const { text, source, isHidden } = req.body;
    let hadith = await Hadith.findById(req.params.id);
    if (!hadith) return res.status(404).json({ msg: 'Hadith not found' });

    if (text) hadith.text = text;
    if (source) hadith.source = source;
    if (isHidden !== undefined) hadith.isHidden = isHidden;

    await hadith.save();
    res.json(hadith);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE hadith
router.delete('/:id', auth, async (req, res) => {
  try {
    const hadith = await Hadith.findById(req.params.id);
    if (!hadith) return res.status(404).json({ msg: 'Hadith not found' });
    await Hadith.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Hadith removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
