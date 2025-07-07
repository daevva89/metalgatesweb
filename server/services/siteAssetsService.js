const SiteAssets = require("../models/SiteAssets");
const FileUploadUtil = require("../utils/fileUpload");
const ImageCleanupUtil = require("../utils/imageCleanup");

class SiteAssetsService {
  async getSiteAssets() {
    try {
      console.log("SiteAssetsService: Getting site assets");
      const assets = await SiteAssets.getSiteAssets();

      console.log("SiteAssetsService: Raw assets from database:", {
        _id: assets._id,
        logo: assets.logo,
        heroImage: assets.heroImage,
        mobileHeroImage: assets.mobileHeroImage,
        countdownDate: assets.countdownDate,
        bannerText: assets.bannerText,
        contactEmails: assets.contactEmails,
        lineupTitle: assets.lineupTitle,
        lineupDescription: assets.lineupDescription,
        googleAnalytics: assets.googleAnalytics,
        metaPixel: assets.metaPixel,
        createdAt: assets.createdAt,
        updatedAt: assets.updatedAt,
      });

      // Convert file paths to URLs
      const response = {
        logo: assets.logo ? FileUploadUtil.getImageUrl(assets.logo) : null,
        heroImage: assets.heroImage
          ? FileUploadUtil.getImageUrl(assets.heroImage)
          : null,
        mobileHeroImage: assets.mobileHeroImage
          ? FileUploadUtil.getImageUrl(assets.mobileHeroImage)
          : null,
        countdownDate: assets.countdownDate,
        bannerText: assets.bannerText,
        contactEmails: assets.contactEmails,
        lineupTitle: assets.lineupTitle,
        lineupDescription: assets.lineupDescription,
        googleAnalytics: assets.googleAnalytics,
        metaPixel: assets.metaPixel,
      };

      console.log(
        "SiteAssetsService: Final response being returned:",
        response
      );
      return response;
    } catch (error) {
      console.error("SiteAssetsService: Error getting site assets:", error);
      throw error;
    }
  }

  async updateSiteAssets(updateData) {
    try {
      console.log("SiteAssetsService: Updating site assets");
      console.log("SiteAssetsService: Update data received:", {
        hasLogo: "logo" in updateData,
        hasHeroImage: "heroImage" in updateData,
        hasMobileHeroImage: "mobileHeroImage" in updateData,
        hasCountdownDate: "countdownDate" in updateData,
      });

      // Get existing assets or create new one
      let assets = await SiteAssets.findOne();
      if (!assets) {
        assets = new SiteAssets();
        console.log("SiteAssetsService: Created new assets document");
      }
      console.log("SiteAssetsService: Current assets retrieved");

      // Update general settings
      if (updateData.bannerText !== undefined) {
        assets.bannerText = updateData.bannerText;
        console.log("SiteAssetsService: Banner text updated");
      }
      if (updateData.contactEmails !== undefined) {
        assets.contactEmails = updateData.contactEmails;
        console.log("SiteAssetsService: Contact emails updated");
      }
      if (updateData.countdownDate !== undefined) {
        assets.countdownDate = new Date(updateData.countdownDate);
        console.log(
          "SiteAssetsService: Countdown date updated to:",
          assets.countdownDate
        );
      }
      if (updateData.lineupTitle !== undefined) {
        assets.lineupTitle = updateData.lineupTitle;
        console.log("SiteAssetsService: Lineup title updated");
      }
      if (updateData.lineupDescription !== undefined) {
        assets.lineupDescription = updateData.lineupDescription;
        console.log("SiteAssetsService: Lineup description updated");
      }
      if (updateData.googleAnalytics !== undefined) {
        assets.googleAnalytics = updateData.googleAnalytics;
        console.log("SiteAssetsService: Google Analytics updated");
      }
      if (updateData.metaPixel !== undefined) {
        assets.metaPixel = updateData.metaPixel;
        console.log("SiteAssetsService: Meta Pixel updated");
      }

      if (updateData.logo !== undefined) {
        console.log("SiteAssetsService: Processing logo update");
        const oldLogoPath = assets.logo;

        if (updateData.logo) {
          // Save new logo
          const logoPath = await FileUploadUtil.saveBase64Image(
            updateData.logo,
            "logo",
            oldLogoPath
          );
          assets.logo = logoPath;
          console.log("SiteAssetsService: Logo updated with new file");
        } else {
          // Remove logo
          if (oldLogoPath) {
            await ImageCleanupUtil.cleanupSiteAssetImages(assets, "logo");
          }
          assets.logo = null;
          console.log("SiteAssetsService: Logo removed");
        }
      }

      if (updateData.heroImage !== undefined) {
        console.log("SiteAssetsService: Processing hero image update");
        const oldHeroPath = assets.heroImage;

        if (updateData.heroImage) {
          // Save new hero image
          const heroPath = await FileUploadUtil.saveBase64Image(
            updateData.heroImage,
            "hero",
            oldHeroPath
          );
          assets.heroImage = heroPath;
          console.log("SiteAssetsService: Hero image updated with new file");
        } else {
          // Remove hero image
          if (oldHeroPath) {
            await ImageCleanupUtil.cleanupSiteAssetImages(assets, "heroImage");
          }
          assets.heroImage = null;
          console.log("SiteAssetsService: Hero image removed");
        }
      }

      if (updateData.mobileHeroImage !== undefined) {
        console.log("SiteAssetsService: Processing mobile hero image update");
        const oldMobileHeroPath = assets.mobileHeroImage;

        if (updateData.mobileHeroImage) {
          // Save new mobile hero image
          const mobileHeroPath = await FileUploadUtil.saveBase64Image(
            updateData.mobileHeroImage,
            "mobile-hero",
            oldMobileHeroPath
          );
          assets.mobileHeroImage = mobileHeroPath;
          console.log(
            "SiteAssetsService: Mobile hero image updated with new file"
          );
        } else {
          // Remove mobile hero image
          if (oldMobileHeroPath) {
            await ImageCleanupUtil.cleanupSiteAssetImages(
              assets,
              "mobileHeroImage"
            );
          }
          assets.mobileHeroImage = null;
          console.log("SiteAssetsService: Mobile hero image removed");
        }
      }

      console.log("SiteAssetsService: About to save assets");
      console.log("SiteAssetsService: Assets object before save:", {
        _id: assets._id,
        logo: assets.logo,
        heroImage: assets.heroImage,
        mobileHeroImage: assets.mobileHeroImage,
        countdownDate: assets.countdownDate,
        bannerText: assets.bannerText,
        contactEmails: assets.contactEmails,
        lineupTitle: assets.lineupTitle,
        lineupDescription: assets.lineupDescription,
        googleAnalytics: assets.googleAnalytics,
        metaPixel: assets.metaPixel,
      });

      // Save the assets
      const updatedAssets = await assets.save();
      console.log("SiteAssetsService: Assets saved successfully");

      console.log("SiteAssetsService: Updated assets from database:", {
        _id: updatedAssets._id,
        logo: updatedAssets.logo,
        heroImage: updatedAssets.heroImage,
        mobileHeroImage: updatedAssets.mobileHeroImage,
        countdownDate: updatedAssets.countdownDate,
        bannerText: updatedAssets.bannerText,
        contactEmails: updatedAssets.contactEmails,
        lineupTitle: updatedAssets.lineupTitle,
        lineupDescription: updatedAssets.lineupDescription,
        googleAnalytics: updatedAssets.googleAnalytics,
        metaPixel: updatedAssets.metaPixel,
        createdAt: updatedAssets.createdAt,
        updatedAt: updatedAssets.updatedAt,
      });

      // Return URLs instead of file paths
      return {
        logo: updatedAssets.logo
          ? FileUploadUtil.getImageUrl(updatedAssets.logo)
          : null,
        heroImage: updatedAssets.heroImage
          ? FileUploadUtil.getImageUrl(updatedAssets.heroImage)
          : null,
        mobileHeroImage: updatedAssets.mobileHeroImage
          ? FileUploadUtil.getImageUrl(updatedAssets.mobileHeroImage)
          : null,
        countdownDate: updatedAssets.countdownDate,
        bannerText: updatedAssets.bannerText,
        contactEmails: updatedAssets.contactEmails,
        lineupTitle: updatedAssets.lineupTitle,
        lineupDescription: updatedAssets.lineupDescription,
        googleAnalytics: updatedAssets.googleAnalytics,
        metaPixel: updatedAssets.metaPixel,
      };
    } catch (error) {
      console.error("SiteAssetsService: Error updating site assets:", error);
      console.error("SiteAssetsService: Error stack:", error.stack);
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
