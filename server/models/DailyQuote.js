const mongoose = require('mongoose');

const DailyQuoteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: String, default: '' },
  category: { type: String, default: 'عام' },
  isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('DailyQuote', DailyQuoteSchema);
