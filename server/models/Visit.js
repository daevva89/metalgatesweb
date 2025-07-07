const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
    required: false, // IP is optional for privacy, can be used for more advanced analytics if enabled
  },
});

visitSchema.index({ timestamp: -1 });

const Visit = mongoose.model("Visit", visitSchema);

module.exports = Visit;
