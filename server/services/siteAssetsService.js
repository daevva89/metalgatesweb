const SiteAssets = require("../models/SiteAssets");

class SiteAssetsService {
  async getSiteAssets() {
    try {
      let assets = await SiteAssets.findOne();
      if (!assets) {
        assets = await this.createDefaultAssets();
      }
      return assets;
    } catch (error) {
      throw error;
    }
  }

  async createDefaultAssets() {
    try {
      const defaultAssets = new SiteAssets({
        logo: null,
        heroImage: null,
      });
      return await defaultAssets.save();
    } catch (error) {
      throw error;
    }
  }

  async updateSiteAssets(updateData) {
    try {
      let assets = await SiteAssets.findOne();
      if (!assets) {
        assets = await this.createDefaultAssets();
      }

      const updatedAssets = await SiteAssets.findByIdAndUpdate(
        assets._id,
        updateData,
        { new: true, runValidators: true }
      );
      return updatedAssets;
    } catch (error) {
      throw error;
    }
  }

  async updateLogo(logoPath) {
    try {
      return await this.updateSiteAssets({ logo: logoPath });
    } catch (error) {
      throw error;
    }
  }

  async updateHeroImage(heroImagePath) {
    try {
      return await this.updateSiteAssets({ heroImage: heroImagePath });
    } catch (error) {
      throw error;
    }
  }

  async removeLogo() {
    try {
      return await this.updateSiteAssets({ logo: null });
    } catch (error) {
      throw error;
    }
  }

  async removeHeroImage() {
    try {
      return await this.updateSiteAssets({ heroImage: null });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new SiteAssetsService();
