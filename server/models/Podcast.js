const mongoose = require('mongoose');
const PodcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  speaker: { type: String, default: '' },         // اسم الشيخ أو المتحدث
  category: { type: String, required: true },      // عقيدة، فقه، تزكية...
  audioUrl: { type: String, required: true },      // رابط الصوت
  imageUrl: { type: String, default: '' },
  duration: { type: String, default: '' },         // "45:30"
  plays: { type: Number, default: 0 },
  isHidden: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Podcast', PodcastSchema);
