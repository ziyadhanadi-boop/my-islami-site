const mongoose = require('mongoose');
const ProphetStorySchema = new mongoose.Schema({
  name: { type: String, required: true },       // اسم النبي
  nameEn:  { type: String, default: '' },
  emoji:   { type: String, default: '📜' },        // إيموجي النبي
  title: { type: String, required: true },       // عنوان القصة
  summary: { type: String, required: true },     // ملخص قصير
  content: { type: String, default: '' },     // المحتوى الكامل (HTML)
  imageUrl: { type: String, default: '' },
  era: { type: String, default: '' },            // الحقبة الزمنية
  mentions: { type: Number, default: 0 },        // كم مرة ذُكر في القرآن
  quranVerses: [{ surah: String, verse: String }],
  order: { type: Number, default: 0 },           // ترتيب العرض
  isHidden: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('ProphetStory', ProphetStorySchema);
