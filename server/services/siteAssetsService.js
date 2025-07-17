const SiteAssets = require("../models/SiteAssets");
const ImageCleanupUtil = require("../utils/imageCleanup");

class SiteAssetsService {
  async getSiteAssets() {
    try {
      let assets = await SiteAssets.findOne({});
      if (!assets) {
        assets = await this.createDefaultAssets();
      }
      return assets;
    } catch (error) {
      console.error("SiteAssetsService: Error fetching site assets:", error);
      throw error;
    }
  }

  async createDefaultAssets() {
    try {
      const defaultAssets = new SiteAssets({});
      const savedAssets = await defaultAssets.save();
      return savedAssets;
    } catch (error) {
      console.error("SiteAssetsService: Error creating default assets:", error);
      throw error;
    }
  }

  async updateAssets(updateData) {
    try {
      let assets = await SiteAssets.findOne({});
      if (!assets) {
        assets = await this.createDefaultAssets();
      }

      Object.assign(assets, updateData);
      const savedAssets = await assets.save();
      return savedAssets;
    } catch (error) {
      console.error("SiteAssetsService: Error updating assets:", error);
      throw error;
    }
  }

  async updateLogo(logoPath) {
    try {
      const assets = await this.getSiteAssets();
      if (assets.logo) {
        await ImageCleanupUtil.cleanupSiteAssetImages(assets, "logo");
      }
      assets.logo = logoPath;
      return await assets.save();
    } catch (error) {
      console.error("SiteAssetsService: Error updating logo:", error);
      throw error;
    }
  }

  async updateHeroImage(heroImagePath) {
    try {
      const assets = await this.getSiteAssets();
      if (assets.heroImage) {
        await ImageCleanupUtil.cleanupSiteAssetImages(assets, "heroImage");
      }
      assets.heroImage = heroImagePath;
      return await assets.save();
    } catch (error) {
      console.error("SiteAssetsService: Error updating hero image:", error);
      throw error;
    }
  }

  async removeLogo() {
    try {
      const assets = await this.getSiteAssets();
      if (assets.logo) {
        await ImageCleanupUtil.cleanupSiteAssetImages(assets, "logo");
      }
      assets.logo = null;
      return await assets.save();
    } catch (error) {
      console.error("SiteAssetsService: Error removing logo:", error);
      throw error;
    }
  }

  async removeHeroImage() {
    try {
      const assets = await this.getSiteAssets();
      if (assets.heroImage) {
        await ImageCleanupUtil.cleanupSiteAssetImages(assets, "heroImage");
      }
      assets.heroImage = null;
      return await assets.save();
    } catch (error) {
      console.error("SiteAssetsService: Error removing hero image:", error);
      throw error;
    }
  }
}

module.exports = new SiteAssetsService();
