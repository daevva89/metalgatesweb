const fs = require("fs").promises;
const path = require("path");
const crypto = require("crypto");

class FileUploadUtil {
  constructor() {
    this.uploadsDir = path.join(__dirname, "..", "uploads");
    this.ensureUploadsDirectory();
  }

  async ensureUploadsDirectory() {
    try {
      await fs.access(this.uploadsDir);
    } catch (error) {
      await fs.mkdir(this.uploadsDir, { recursive: true });

      const subdirs = ["logos", "heroes", "bands", "news", "archives"];
      for (const subdir of subdirs) {
        const subdirPath = path.join(this.uploadsDir, subdir);
        await fs.mkdir(subdirPath, { recursive: true });
      }
    }
  }

  generateFileName(originalName, category) {
    const timestamp = Date.now();
    const random = crypto.randomBytes(8).toString("hex");
    const extension = path.extname(originalName) || ".jpg";
    return `${category}_${timestamp}_${random}${extension}`;
  }

  async saveBase64Image(imageData, category, oldFilePath = null) {
    try {
      if (!imageData) {
        return null;
      }

      if (
        imageData.startsWith("/api/uploads/") ||
        imageData.startsWith("uploads/")
      ) {
        return imageData.startsWith("/api/uploads/")
          ? imageData.replace("/api/", "")
          : imageData;
      }

      const matches = imageData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        throw new Error("Invalid base64 data format");
      }

      const mimeType = matches[1];
      const base64Content = matches[2];

      let extension = ".jpg";
      if (mimeType.includes("png")) extension = ".png";
      else if (mimeType.includes("gif")) extension = ".gif";
      else if (mimeType.includes("webp")) extension = ".webp";

      const fileName = this.generateFileName(`image${extension}`, category);
      const categoryDir = this.getCategoryDirectory(category);
      const filePath = path.join(categoryDir, fileName);
      const relativePath = path.join(
        "uploads",
        this.getCategoryName(category),
        fileName
      );

      const buffer = Buffer.from(base64Content, "base64");
      await fs.writeFile(filePath, buffer);

      if (oldFilePath) {
        await this.deleteImage(oldFilePath);
      }

      return relativePath;
    } catch (error) {
      throw error;
    }
  }

  getCategoryDirectory(category) {
    const categoryMap = {
      logo: "logos",
      hero: "heroes",
      band: "bands",
      news: "news",
      archive: "archives",
    };
    const categoryName = categoryMap[category] || "misc";
    return path.join(this.uploadsDir, categoryName);
  }

  getCategoryName(category) {
    const categoryMap = {
      logo: "logos",
      hero: "heroes",
      band: "bands",
      news: "news",
      archive: "archives",
    };
    return categoryMap[category] || "misc";
  }

  async deleteImage(filePath) {
    try {
      if (!filePath) return;

      const fullPath = path.join(__dirname, "..", filePath);
      await fs.access(fullPath);
      await fs.unlink(fullPath);
    } catch (error) {}
  }

  getImageUrl(filePath) {
    if (!filePath) return null;
    return `/api/uploads/${filePath.replace("uploads/", "")}`;
  }
}

module.exports = new FileUploadUtil();
