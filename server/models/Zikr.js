const mongoose = require('mongoose');

const ZikrSchema = new mongoose.Schema({
  text: { type: String, required: true },
  count: { type: Number, default: 1 }, // Added for repetition count
  description: { type: String },
  category: { type: String, default: 'general' },
  isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Zikr', ZikrSchema);
