const mongoose = require("mongoose");

const bandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  genre: {
    type: String,
    required: false,
    trim: true,
    default: "",
  },
  image: {
    type: String, // file path to uploaded image
    default: null,
  },
  biography: {
    type: String,
    required: true,
  },
  spotifyEmbed: {
    type: String,
    default: "",
  },
  socialLinks: {
    facebook: {
      type: String,
      default: "",
    },
    instagram: {
      type: String,
      default: "",
    },
    youtube: {
      type: String,
      default: "",
    },
    tiktok: {
      type: String,
      default: "",
    },
    bandcamp: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
  },
  performanceDay: {
    type: String,
    enum: [
      "25 September - WARMUP",
      "26 September - DAY 1",
      "27 September - DAY 2",
    ],
    default: "25 September - WARMUP",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update the updatedAt field
bandSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Band", bandSchema);
