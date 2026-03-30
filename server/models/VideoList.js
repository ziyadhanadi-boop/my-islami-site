const mongoose = require('mongoose');
const videoListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  duration: { type: String, required: true },
  views: { type: String, default: '0' },
  thumbnailUrl: { type: String, required: true },
  videoUrl: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('VideoList', videoListSchema);