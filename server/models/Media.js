const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true }, // YouTube URL or audio file link
  type: { type: String, enum: ['audio', 'video'], required: true },
  category: { type: String, enum: ['reciter', 'fatwa'], required: true },
  description: { type: String },
  isHidden: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Media', MediaSchema);
