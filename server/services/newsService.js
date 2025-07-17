const NewsArticle = require("../models/NewsArticle");
const FileUploadUtil = require("../utils/fileUpload");
const ImageCleanupUtil = require("../utils/imageCleanup");

class NewsService {
  async createArticle(articleData) {
    try {
      const article = new NewsArticle({
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content,
        image: articleData.image,
        publishedAt: articleData.publishedAt || new Date(),
      });

      const savedArticle = await article.save();
      return savedArticle;
    } catch (error) {
      console.error("NewsService: Error creating article:", error);
      throw error;
    }
  }

  async getAllArticles() {
    try {
      const articles = await NewsArticle.find()
        .sort({ publishedAt: -1 })
        .select({
          title: 1,
          excerpt: 1,
          content: 1,
          image: 1,
          publishedAt: 1,
          updatedAt: 1,
        });
      return articles;
    } catch (error) {
      console.error("NewsService: Error fetching articles:", error);
      throw error;
    }
  }

  async getArticleById(articleId) {
    try {
      const article = await NewsArticle.findById(articleId);
      if (!article) {
        throw new Error("Article not found");
      }
      return article;
    } catch (error) {
      console.error("NewsService: Error fetching article:", error);
      throw error;
    }
  }

  async updateArticle(articleId, updateData) {
    try {
      const existingArticle = await NewsArticle.findById(articleId);
      if (!existingArticle) {
        throw new Error("Article not found");
      }

      let imagePath = existingArticle.image;
      if (updateData.image !== undefined) {
        // A new image is being uploaded or the existing one is removed.
        // Clean up the old image first.
        if (existingArticle.image) {
          await ImageCleanupUtil.cleanupNewsImages(existingArticle);
        }

        if (updateData.image) {
          // New image provided. Store its relative path.
          imagePath = updateData.image.replace("/api/", "");
        } else {
          // Image is being removed.
          imagePath = null;
        }
      }

      const updatedArticle = await NewsArticle.findByIdAndUpdate(
        articleId,
        {
          title: updateData.title,
          excerpt: updateData.excerpt,
          content: updateData.content,
          image: imagePath,
          publishedAt: updateData.publishedAt || existingArticle.publishedAt,
        },
        { new: true }
      );

      if (!updatedArticle) {
        throw new Error("Article not found");
      }
      return updatedArticle;
    } catch (error) {
      console.error("NewsService: Error updating article:", error);
      throw error;
    }
  }

  async deleteArticle(articleId) {
    try {
      const article = await NewsArticle.findById(articleId);
      if (!article) {
        throw new Error("Article not found");
      }

      // Clean up associated images
      await ImageCleanupUtil.cleanupNewsImages(article);

      await NewsArticle.findByIdAndDelete(articleId);
      return article;
    } catch (error) {
      console.error("NewsService: Error deleting article:", error);
      throw error;
    }
  }
}

module.exports = new NewsService();
