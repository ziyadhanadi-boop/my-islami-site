const express = require('express');
const router = express.Router();
const Dua = require('../models/Dua');
const auth = require('../middleware/auth');

// GET all (public) — with optional category filter
router.get('/', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { isHidden: { $ne: true } };
    if (req.query.category) filter.category = req.query.category;
    const duas = await Dua.find(filter).sort({ category: 1, createdAt: -1 });
    res.json(duas);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// GET categories list (public)
router.get('/categories', async (req, res) => {
  try {
    const cats = await Dua.distinct('category', { isHidden: { $ne: true } });
    res.json(cats);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// GET single dua (public)
router.get('/:id', async (req, res) => {
  try {
    const dua = await Dua.findById(req.params.id);
    if (!dua) return res.status(404).json({ msg: 'غير موجود' });
    res.json(dua);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// POST create (admin)
router.post('/', auth, async (req, res) => {
  try {
    const dua = new Dua(req.body);
    await dua.save();
    res.json(dua);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// PUT update (admin)
router.put('/:id', auth, async (req, res) => {
  try {
    const dua = await Dua.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(dua);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// PUT toggle visibility (admin)
router.put('/:id/toggle-visibility', auth, async (req, res) => {
  try {
    const dua = await Dua.findById(req.params.id);
    dua.isHidden = !dua.isHidden;
    await dua.save();
    res.json(dua);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// DELETE (admin)
router.delete('/:id', auth, async (req, res) => {
  try {
    await Dua.findByIdAndDelete(req.params.id);
    res.json({ msg: 'تم الحذف' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;
