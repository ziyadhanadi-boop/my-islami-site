const mongoose = require('mongoose');

const HadithSchema = new mongoose.Schema({
  text: { type: String, required: true },
  source: { type: String, required: true },
  isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Hadith', HadithSchema);
