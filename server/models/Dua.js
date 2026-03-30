const mongoose = require('mongoose');
const DuaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  arabicText: { type: String, required: true },
  transliteration: { type: String },
  meaning: { type: String },
  source: { type: String, default: '' },
  category: { type: String, required: true },
  occasion: { type: String, default: '' },  // e.g. "عند النوم", "للكرب"
  isHidden: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Dua', DuaSchema);
