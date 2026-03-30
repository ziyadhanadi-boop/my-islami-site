const express = require('express');
const router = express.Router();
const Tibb = require('../models/Tibb');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { isHidden: { $ne: true } };
    if (req.query.category) filter.category = req.query.category;
    const items = await Tibb.find(filter).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.get('/categories', async (req, res) => {
  try {
    const cats = await Tibb.distinct('category', { isHidden: { $ne: true } });
    res.json(cats);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const item = await Tibb.findById(req.params.id);
    if (!item) return res.status(404).json({ msg: 'غير موجود' });
    res.json(item);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const item = new Tibb(req.body);
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const item = await Tibb.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(item);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.put('/:id/toggle-visibility', auth, async (req, res) => {
  try {
    const item = await Tibb.findById(req.params.id);
    item.isHidden = !item.isHidden;
    await item.save();
    res.json(item);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Tibb.findByIdAndDelete(req.params.id);
    res.json({ msg: 'تم الحذف' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;
