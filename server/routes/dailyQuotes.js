const express = require('express');
const router = express.Router();
const DailyQuote = require('../models/DailyQuote');
const auth = require('../middleware/auth');

// GET all (public) - with optional admin=true to see hidden
router.get('/', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { isHidden: { $ne: true } };
    const quotes = await DailyQuote.find(filter).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// GET random (public)
router.get('/random', async (req, res) => {
  try {
    const count = await DailyQuote.countDocuments({ isHidden: { $ne: true } });
    if (count === 0) return res.status(404).json({ msg: 'لا توجد رسائل مسجلة' });
    const random = Math.floor(Math.random() * count);
    const quote = await DailyQuote.findOne({ isHidden: { $ne: true } }).skip(random);
    res.json(quote);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// POST create (admin)
router.post('/', auth, async (req, res) => {
  try {
    const quote = new DailyQuote(req.body);
    await quote.save();
    res.json(quote);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// PUT update (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const quote = await DailyQuote.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(quote);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// PUT toggle visibility (admin)
router.put('/:id/toggle-visibility', auth, async (req, res) => {
  try {
    const quote = await DailyQuote.findById(req.params.id);
    quote.isHidden = !quote.isHidden;
    await quote.save();
    res.json(quote);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// DELETE (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await DailyQuote.findByIdAndDelete(req.params.id);
    res.json({ msg: 'تم الحذف' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;
