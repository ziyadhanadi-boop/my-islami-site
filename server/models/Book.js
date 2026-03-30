const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  pages: { type: Number, required: true },
  format: { type: String, default: 'PDF' },
  coverUrl: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Book', bookSchema);