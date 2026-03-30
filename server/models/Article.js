const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, unique: true, sparse: true },
  author: { type: String, default: 'فريق التحرير' },
  status: { type: String, default: 'published' },
  category: { type: String, required: true },
  imageUrl: { type: String, required: false },
  tags: { type: [String], default: [] },
  isFeatured: { type: Boolean, default: false },
  featuredPosition: { type: Number, default: 0 },
  isHidden: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  ratingSum: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

ArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Article', ArticleSchema);
