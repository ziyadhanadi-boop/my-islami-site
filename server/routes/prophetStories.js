const express = require('express');
const router = express.Router();
const ProphetStory = require('../models/ProphetStory');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = req.query.admin === 'true' ? {} : { isHidden: { $ne: true } };
    const stories = await ProphetStory.find(filter).sort({ order: 1, createdAt: 1 });
    res.json(stories);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const story = await ProphetStory.findById(req.params.id);
    if (!story) return res.status(404).json({ msg: 'غير موجود' });
    res.json(story);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const story = new ProphetStory(req.body);
    await story.save();
    res.json(story);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const story = await ProphetStory.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(story);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.put('/:id/toggle-visibility', auth, async (req, res) => {
  try {
    const s = await ProphetStory.findById(req.params.id);
    s.isHidden = !s.isHidden;
    await s.save();
    res.json(s);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await ProphetStory.findByIdAndDelete(req.params.id);
    res.json({ msg: 'تم الحذف' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;
