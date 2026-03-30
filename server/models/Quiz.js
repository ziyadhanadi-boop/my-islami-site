const mongoose = require('mongoose');
const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answerIndex: { type: Number, required: true },
  isHidden: { type: Boolean, default: false }
}, { timestamps: true });
module.exports = mongoose.model('Quiz', quizSchema);