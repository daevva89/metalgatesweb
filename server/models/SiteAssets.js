const mongoose = require("mongoose");

const siteAssetsSchema = new mongoose.Schema(
  {
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
      default: "Lineup",
    },
    lineupDescription: {
      type: String,
      default: "",
    },
    gtmId: {
      type: String,
      default: "",
    },
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
    copyright: {
      type: String,
      default: "© 2024 Metal Gates Festival. All rights reserved.",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "site_assets",
  }
);

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
