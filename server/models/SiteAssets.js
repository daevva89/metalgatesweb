const mongoose = require('mongoose');

const siteAssetsSchema = new mongoose.Schema({
  logo: {
    type: String, // file path to uploaded image
    default: null
  },
  heroImage: {
    type: String, // file path to uploaded image
    default: null
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
siteAssetsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure only one document exists (singleton pattern)
siteAssetsSchema.statics.getSiteAssets = async function() {
  let assets = await this.findOne();
  if (!assets) {
    assets = await this.create({});
  }
  return assets;
};

module.exports = mongoose.model('SiteAssets', siteAssetsSchema);