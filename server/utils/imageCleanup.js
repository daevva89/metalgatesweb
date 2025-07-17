const FileUploadUtil = require("./fileUpload");
const fs = require("fs");
const path = require("path");

class ImageCleanupUtil {
  static async cleanupBandImages(band) {
    if (band.image) {
      await this.deleteImageFile(band.image);
    }
  }

  static async cleanupNewsImages(article) {
    if (article.image) {
      await this.deleteImageFile(article.image);
    }
  }

  static async cleanupArchiveImages(archive) {
    if (archive.image) {
      await this.deleteImageFile(archive.image);
    }
  }

  static async cleanupSiteAssetImages(asset, field) {
    if (asset[field]) {
      await this.deleteImageFile(asset[field]);
    }
  }

  static async deleteImageFile(imagePath) {
    if (!imagePath) return;

    try {
      const fullPath = path.join(__dirname, "..", "uploads", imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    } catch (error) {
      console.error(
        `ImageCleanupUtil: Error deleting image file ${imagePath}:`,
        error
      );
    }
  }
}

module.exports = new ImageCleanupUtil();
