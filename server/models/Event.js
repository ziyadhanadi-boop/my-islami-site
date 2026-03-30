const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  locationName: {
    type: String, // e.g., 'Masjid Al-Rawdah'
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    enum: ['محاضرة', 'مائدة إفطار', 'دروس علمية', 'فعالية اجتماعية'],
    default: 'محاضرة'
  },
  organizer: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isHidden: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Event', EventSchema);
