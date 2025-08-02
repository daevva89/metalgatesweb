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
    cookiebotId: {
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
    seoTitles: {
      type: Object,
      default: {
        home: "Metal Gates Festival",
        news: "News - Metal Gates Festival",
        newsArticle: "News Article - Metal Gates Festival",
        info: "Info - Metal Gates Festival",
        notFound: "404 - Page Not Found - Metal Gates Festival",
        login: "Login - Metal Gates Festival",
        contact: "Contact - Metal Gates Festival",
        archive: "Archive - Metal Gates Festival",
        lineup: "Lineup - Metal Gates Festival",
      },
    },
    seoDescriptions: {
      type: Object,
      default: {
        home: "Official website for Metal Gates Festival. Get the latest news, lineup, tickets, and info.",
        news: "Read the latest news and updates about Metal Gates Festival.",
        newsArticle: "Detailed article about Metal Gates Festival.",
        info: "Find all the information you need about Metal Gates Festival.",
        notFound: "Page not found on Metal Gates Festival website.",
        login: "Login to the Metal Gates Festival admin panel.",
        contact: "Contact Metal Gates Festival organizers.",
        archive: "Explore the archive of past Metal Gates Festival events.",
        lineup: "See the full lineup for Metal Gates Festival.",
      },
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
