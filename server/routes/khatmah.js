const express = require('express');
const router = express.Router();
const LiveKhatmah = require('../models/LiveKhatmah');
const auth = require('../middleware/auth');

// GET current khatmah stats
router.get('/stats', async (req, res) => {
  try {
    let stats = await LiveKhatmah.findOne();
    if (!stats) {
      stats = await LiveKhatmah.create({ total_pages: 0, current_completion_count: 0 });
    }
    res.json(stats);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// POST to add pages to the global khatmah
router.post('/add-pages', async (req, res) => {
  const { pages } = req.body;
  
  if (!pages || isNaN(pages) || pages <= 0) {
    return res.status(400).json({ msg: "Please provide a valid number of pages" });
  }

  try {
    let stats = await LiveKhatmah.findOne();
    if (!stats) {
      stats = await LiveKhatmah.create({ total_pages: 0, current_completion_count: 0 });
    }

    stats.total_pages += parseInt(pages);
    
    // Check if a full Quran (604 pages) is completed
    const fullKhatmahCount = Math.floor(stats.total_pages / 604);
    if (fullKhatmahCount > stats.current_completion_count) {
      stats.current_completion_count = fullKhatmahCount;
    }

    stats.last_updated = Date.now();
    await stats.save();

    res.json(stats);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Admin Update: Set target completion goal
router.put('/admin-goal', auth, async (req, res) => {
  const { goal } = req.body;
  try {
    const stats = await LiveKhatmah.findOneAndUpdate({}, { target_completion_goal: goal }, { new: true, upsert: true });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Admin Update: Reset/Renew Khatmah
router.put('/reset', auth, async (req, res) => {
  try {
    const stats = await LiveKhatmah.findOneAndUpdate({}, { total_pages: 0 }, { new: true });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Admin Update: Edit Stats Manually
router.put('/update-stats', auth, async (req, res) => {
  const { total_pages, current_completion_count } = req.body;
  try {
    const stats = await LiveKhatmah.findOneAndUpdate({}, { 
      total_pages: parseInt(total_pages), 
      current_completion_count: parseInt(current_completion_count) 
    }, { new: true });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
