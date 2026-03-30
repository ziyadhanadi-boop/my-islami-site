const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const auth = require('../middleware/auth');

// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// POST a new event (Admin only)
router.post('/', auth, async (req, res) => {
  const { title, description, locationName, lat, lng, date, type, organizer } = req.body;
  try {
    const newEvent = new Event({ title, description, locationName, lat, lng, date, type, organizer });
    const savedEvent = await newEvent.save();
    res.json(savedEvent);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// DELETE an event
router.delete('/:id', auth, async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ msg: 'تم الحذف بنجاح' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// UPDATE an event (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
