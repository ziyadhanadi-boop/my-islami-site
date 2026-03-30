const mongoose = require('mongoose');

const LiveKhatmahSchema = new mongoose.Schema({
  total_pages: {
    type: Number,
    default: 0
  },
  current_completion_count: {
    type: Number,
    default: 0
  },
  target_completion_goal: {
    type: Number,
    default: 100 // Default goal for administrative control
  },
  last_updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LiveKhatmah', LiveKhatmahSchema);
