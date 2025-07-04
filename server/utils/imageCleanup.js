const FileUploadUtil = require('./fileUpload');

class ImageCleanupUtil {
  async cleanupBandImages(band) {
    try {
      console.log('ImageCleanupUtil: Cleaning up band images');
      if (band.image) {
        await FileUploadUtil.deleteImage(band.image);
      }
    } catch (error) {
      console.error('ImageCleanupUtil: Error cleaning up band images:', error);
    }
  }

  async cleanupNewsImages(article) {
    try {
      console.log('ImageCleanupUtil: Cleaning up news article images');
      if (article.image) {
        await FileUploadUtil.deleteImage(article.image);
      }
    } catch (error) {
      console.error('ImageCleanupUtil: Error cleaning up news images:', error);
    }
  }

  async cleanupArchiveImages(archive) {
    try {
      console.log('ImageCleanupUtil: Cleaning up archive images');
      if (archive.poster) {
        await FileUploadUtil.deleteImage(archive.poster);
      }
    } catch (error) {
      console.error('ImageCleanupUtil: Error cleaning up archive images:', error);
    }
  }

  async cleanupSiteAssetImages(assets, field) {
    try {
      console.log(`ImageCleanupUtil: Cleaning up site asset ${field}`);
      if (assets[field]) {
        await FileUploadUtil.deleteImage(assets[field]);
      }
    } catch (error) {
      console.error(`ImageCleanupUtil: Error cleaning up site asset ${field}:`, error);
    }
  }
}

module.exports = new ImageCleanupUtil();