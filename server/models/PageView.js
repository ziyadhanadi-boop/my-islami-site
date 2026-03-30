const mongoose = require('mongoose');

const PageViewSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Format: YYYY-MM-DD
  country: { type: String, default: 'غير معروف' },
  countryCode: { type: String, default: 'xx' },
  path: { type: String, default: '/' },
  count: { type: Number, default: 1 }
}, { timestamps: true });

// Compound index for fast lookups
PageViewSchema.index({ date: 1, country: 1 });

module.exports = mongoose.model('PageView', PageViewSchema);
