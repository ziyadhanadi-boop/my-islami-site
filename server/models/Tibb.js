const mongoose = require('mongoose');
const TibbSchema = new mongoose.Schema({
  name: { type: String, required: true },        // اسم العشبة أو الغذاء
  category: { type: String, required: true },    // أعشاب، أطعمة، وصفات، حجامة
  imageUrl: { type: String, default: '' },
  hadith: { type: String, default: '' },         // الحديث النبوي المتعلق
  hadithSource: { type: String, default: '' },
  benefits: [String],                            // قائمة الفوائد
  scientificNote: { type: String, default: '' }, // ملاحظة علمية حديثة
  usage: { type: String, default: '' },          // طريقة الاستخدام
  warning: { type: String, default: '' },        // تحذيرات
  isHidden: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = mongoose.model('Tibb', TibbSchema);
