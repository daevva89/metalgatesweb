const mongoose = require('mongoose');

const archiveSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    trim: true
  },
  poster: {
    type: String, // file path to uploaded image
    default: null
  },
  lineup: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to update the updatedAt field
archiveSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Archive', archiveSchema);