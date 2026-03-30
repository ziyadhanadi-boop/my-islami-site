const express = require('express');
const router = express.Router();
const PageView = require('../models/PageView');
const Article = require('../models/Article');
const auth = require('../middleware/auth');

// POST /api/analytics/track — called from frontend on each page load
router.post('/track', async (req, res) => {
  try {
    const { country, countryCode, path } = req.body;
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // Upsert: increment count for this date+country+path combo
    await PageView.findOneAndUpdate(
      { date: today, country: country || 'غير معروف', path: path || '/' },
      { $inc: { count: 1 }, $set: { countryCode: countryCode || 'xx' } },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: 'Tracking error' });
  }
});

// GET /api/analytics/weekly — last 7 days visit counts (Admin only)
router.get('/weekly', auth, async (req, res) => {
  try {
    const days = [];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      days.push(dateStr);
      // Arabic day names
      const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      labels.push(dayNames[d.getDay()]);
    }

    const views = await PageView.aggregate([
      { $match: { date: { $in: days } } },
      { $group: { _id: '$date', total: { $sum: '$count' } } },
      { $sort: { _id: 1 } }
    ]);

    // Map results to days array
    const data = days.map(day => {
      const found = views.find(v => v._id === day);
      return found ? found.total : 0;
    });

    res.json({ labels, data, totalThisWeek: data.reduce((a, b) => a + b, 0) });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching weekly stats' });
  }
});

// GET /api/analytics/countries — top countries (Admin only)
router.get('/countries', auth, async (req, res) => {
  try {
    const last30 = new Date();
    last30.setDate(last30.getDate() - 30);
    const last30Str = last30.toISOString().split('T')[0];

    const countries = await PageView.aggregate([
      { $match: { date: { $gte: last30Str } } },
      { $group: { _id: { country: '$country', countryCode: '$countryCode' }, total: { $sum: '$count' } } },
      { $sort: { total: -1 } },
      { $limit: 8 },
      { $project: { _id: 0, country: '$_id.country', countryCode: '$_id.countryCode', total: 1 } }
    ]);

    res.json(countries);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching country stats' });
  }
});

// GET /api/analytics/overview — full dashboard stats (Admin only)
router.get('/overview', auth, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const todayViews = await PageView.aggregate([
      { $match: { date: today } },
      { $group: { _id: null, total: { $sum: '$count' } } }
    ]);

    const totalViews = await PageView.aggregate([
      { $group: { _id: null, total: { $sum: '$count' } } }
    ]);

    res.json({
      todayViews: todayViews[0]?.total || 0,
      totalViews: totalViews[0]?.total || 0
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching overview' });
  }
});

module.exports = router;
