const express = require('express');
const router = express.Router();
const Podcast = require('../models/Podcast');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { isHidden: { $ne: true } };
    if (req.query.category) filter.category = req.query.category;
    const podcasts = await Podcast.find(filter).sort({ createdAt: -1 });
    res.json(podcasts);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const pod = await Podcast.findById(req.params.id);
    if (!pod) return res.status(404).json({ msg: 'غير موجود' });
    res.json(pod);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Increment play count
router.post('/:id/play', async (req, res) => {
  try {
    await Podcast.findByIdAndUpdate(req.params.id, { $inc: { plays: 1 } });
    res.json({ ok: true });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const pod = new Podcast(req.body);
    await pod.save();
    res.json(pod);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const pod = await Podcast.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(pod);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.put('/:id/toggle-visibility', auth, async (req, res) => {
  try {
    const pod = await Podcast.findById(req.params.id);
    pod.isHidden = !pod.isHidden;
    await pod.save();
    res.json(pod);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await Podcast.findByIdAndDelete(req.params.id);
    res.json({ msg: 'تم الحذف' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;
