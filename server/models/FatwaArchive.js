const mongoose = require('mongoose');
const fatwaArchiveSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, default: 'عام' },
  position: { type: Number, default: 0 },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('FatwaArchive', fatwaArchiveSchema);