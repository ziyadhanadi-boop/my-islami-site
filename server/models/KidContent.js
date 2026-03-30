const mongoose = require('mongoose');
const kidContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, enum: ['wudu', 'salah', 'adhkar', 'stories'] },
  contentType: { type: String, required: true, enum: ['text', 'video', 'image', 'mixed'] },
  contentBody: { type: String, required: true }, // Can contain text, image urls, or video urls
  coverImage: { type: String, default: '' },
  orderIndex: { type: Number, default: 0 }, // For ordering steps like Wudu
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('KidContent', kidContentSchema);