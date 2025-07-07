const mongoose = require("mongoose");

const siteAssetsSchema = new mongoose.Schema({
  logo: {
    type: String, // file path to uploaded image
    default: null,
  },
  heroImage: {
    type: String, // file path to uploaded image
    default: null,
  },
  mobileHeroImage: {
    type: String, // file path to uploaded mobile hero image
    default: null,
  },
  countdownDate: {
    type: Date, // target date for countdown timer
    default: new Date("2025-09-26T17:00:00+03:00"), // Default to September 26th, 2025, 17:00 Romanian time
  },
  bannerText: {
    type: String,
    default: "🎸 Early Bird Tickets Available Now! Limited Time Offer 🎸",
  },
  contactEmails: [
    {
      purpose: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
  ],
  lineupTitle: {
    type: String,
    default: "Lineup 2024",
  },
  lineupDescription: {
    type: String,
    default:
      "Get ready for an incredible lineup of metal legends and rising stars that will make this festival unforgettable",
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
siteAssetsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure only one document exists (singleton pattern)
siteAssetsSchema.statics.getSiteAssets = async function () {
  let assets = await this.findOne();
  if (!assets) {
    assets = await this.create({});
  }
  return assets;
};

module.exports = mongoose.model("SiteAssets", siteAssetsSchema);
