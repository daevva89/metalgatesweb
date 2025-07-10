const SiteAssets = require("../models/SiteAssets");

class SiteAssetsService {
  async getSiteAssets() {
    try {
      const assets = await SiteAssets.getSiteAssets();
      return assets;
    } catch (error) {
      console.error("SiteAssetsService: Error getting site assets:", error);
      throw error;
    }
  }

  async updateSiteAssets(updateData) {
    try {
      console.log(
        "SiteAssetsService: Updating site assets with data:",
        updateData
      );

      let assets = await SiteAssets.findOne();
      if (!assets) {
        assets = new SiteAssets();
      }

      // Directly update fields from updateData
      Object.keys(updateData).forEach((key) => {
        // Special handling for empty image fields to set them to null
        if (
          ["logo", "heroImage", "mobileHeroImage"].includes(key) &&
          updateData[key] === ""
        ) {
          assets[key] = null;
        } else if (updateData[key] !== undefined) {
          assets[key] = updateData[key];
        }
      });

      if (
        updateData.contactEmails &&
        typeof updateData.contactEmails === "string"
      ) {
        try {
          assets.contactEmails = JSON.parse(updateData.contactEmails);
        } catch (e) {
          console.error("Error parsing contactEmails", e);
        }
      }

      const updatedAssets = await assets.save();
      console.log("SiteAssetsService: Assets saved successfully");
      return updatedAssets;
    } catch (error) {
      console.error("SiteAssetsService: Error updating site assets:", error);
      throw error;
    }
  }

  async updateLogo(logoData) {
    try {
      console.log("SiteAssetsService: Updating logo");
      return await this.updateSiteAssets({ logo: logoData });
    } catch (error) {
      console.error("SiteAssetsService: Error updating logo:", error);
      throw error;
    }
  }

  async updateHeroImage(heroImageData) {
    try {
      console.log("SiteAssetsService: Updating hero image");
      return await this.updateSiteAssets({ heroImage: heroImageData });
    } catch (error) {
      console.error("SiteAssetsService: Error updating hero image:", error);
      throw error;
    }
  }

  async removeLogo() {
    try {
      console.log("SiteAssetsService: Removing logo");
      return await this.updateSiteAssets({ logo: null });
    } catch (error) {
      console.error("SiteAssetsService: Error removing logo:", error);
      throw error;
    }
  }

  async removeHeroImage() {
    try {
      console.log("SiteAssetsService: Removing hero image");
      return await this.updateSiteAssets({ heroImage: null });
    } catch (error) {
      console.error("SiteAssetsService: Error removing hero image:", error);
      throw error;
    }
  }
}

module.exports = new SiteAssetsService();
