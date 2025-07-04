const SiteAssets = require('../models/SiteAssets');
const FileUploadUtil = require('../utils/fileUpload');
const ImageCleanupUtil = require('../utils/imageCleanup');

class SiteAssetsService {
  async getSiteAssets() {
    try {
      console.log('SiteAssetsService: Getting site assets');
      const assets = await SiteAssets.getSiteAssets();
      
      // Convert file paths to URLs
      const response = {
        logo: assets.logo ? FileUploadUtil.getImageUrl(assets.logo) : null,
        heroImage: assets.heroImage ? FileUploadUtil.getImageUrl(assets.heroImage) : null
      };
      
      console.log('SiteAssetsService: Site assets retrieved successfully');
      return response;
    } catch (error) {
      console.error('SiteAssetsService: Error getting site assets:', error);
      throw error;
    }
  }

  async updateSiteAssets(updateData) {
    try {
      console.log('SiteAssetsService: Updating site assets');
      console.log('SiteAssetsService: Update data received:', {
        hasLogo: 'logo' in updateData,
        hasHeroImage: 'heroImage' in updateData
      });

      let assets = await SiteAssets.getSiteAssets();
      console.log('SiteAssetsService: Current assets retrieved');

      if (updateData.logo !== undefined) {
        console.log('SiteAssetsService: Processing logo update');
        const oldLogoPath = assets.logo;
        
        if (updateData.logo) {
          // Save new logo
          const logoPath = await FileUploadUtil.saveBase64Image(updateData.logo, 'logo', oldLogoPath);
          assets.logo = logoPath;
          console.log('SiteAssetsService: Logo updated with new file');
        } else {
          // Remove logo
          if (oldLogoPath) {
            await ImageCleanupUtil.cleanupSiteAssetImages(assets, 'logo');
          }
          assets.logo = null;
          console.log('SiteAssetsService: Logo removed');
        }
      }

      if (updateData.heroImage !== undefined) {
        console.log('SiteAssetsService: Processing hero image update');
        const oldHeroPath = assets.heroImage;
        
        if (updateData.heroImage) {
          // Save new hero image
          const heroPath = await FileUploadUtil.saveBase64Image(updateData.heroImage, 'hero', oldHeroPath);
          assets.heroImage = heroPath;
          console.log('SiteAssetsService: Hero image updated with new file');
        } else {
          // Remove hero image
          if (oldHeroPath) {
            await ImageCleanupUtil.cleanupSiteAssetImages(assets, 'heroImage');
          }
          assets.heroImage = null;
          console.log('SiteAssetsService: Hero image removed');
        }
      }

      console.log('SiteAssetsService: About to save assets');
      const updatedAssets = await assets.save();
      console.log('SiteAssetsService: Site assets updated successfully');
      
      // Return URLs instead of file paths
      return {
        logo: updatedAssets.logo ? FileUploadUtil.getImageUrl(updatedAssets.logo) : null,
        heroImage: updatedAssets.heroImage ? FileUploadUtil.getImageUrl(updatedAssets.heroImage) : null
      };
    } catch (error) {
      console.error('SiteAssetsService: Error updating site assets:', error);
      console.error('SiteAssetsService: Error stack:', error.stack);
      throw error;
    }
  }

  async updateLogo(logoData) {
    try {
      console.log('SiteAssetsService: Updating logo');
      return await this.updateSiteAssets({ logo: logoData });
    } catch (error) {
      console.error('SiteAssetsService: Error updating logo:', error);
      throw error;
    }
  }

  async updateHeroImage(heroImageData) {
    try {
      console.log('SiteAssetsService: Updating hero image');
      return await this.updateSiteAssets({ heroImage: heroImageData });
    } catch (error) {
      console.error('SiteAssetsService: Error updating hero image:', error);
      throw error;
    }
  }

  async removeLogo() {
    try {
      console.log('SiteAssetsService: Removing logo');
      return await this.updateSiteAssets({ logo: null });
    } catch (error) {
      console.error('SiteAssetsService: Error removing logo:', error);
      throw error;
    }
  }

  async removeHeroImage() {
    try {
      console.log('SiteAssetsService: Removing hero image');
      return await this.updateSiteAssets({ heroImage: null });
    } catch (error) {
      console.error('SiteAssetsService: Error removing hero image:', error);
      throw error;
    }
  }
}

module.exports = new SiteAssetsService();