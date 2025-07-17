const NewsArticle = require("../models/NewsArticle");

class NewsService {
  async createArticle(articleData) {
    try {
      const article = new NewsArticle(articleData);
      const savedArticle = await article.save();
      return savedArticle;
    } catch (error) {
      throw error;
    }
  }

  async getAllArticles() {
    try {
      const articles = await NewsArticle.find()
        .sort({ publishedAt: -1 })
        .lean();
      return articles;
    } catch (error) {
      throw error;
    }
  }

  async getArticleById(articleId) {
    try {
      const article = await NewsArticle.findById(articleId).lean();
      if (!article) {
        throw new Error("Article not found");
      }
      return article;
    } catch (error) {
      throw error;
    }
  }

  async getPublishedArticles(limit = 10) {
    try {
      const articles = await NewsArticle.find({
        publishedAt: { $lte: new Date() },
      })
        .sort({ publishedAt: -1 })
        .limit(limit)
        .lean();
      return articles;
    } catch (error) {
      throw error;
    }
  }

  async updateArticle(articleId, updateData) {
    try {
      const article = await NewsArticle.findByIdAndUpdate(
        articleId,
        {
          ...updateData,
          updatedAt: new Date(),
        },
        { new: true, runValidators: true }
      );

      if (!article) {
        throw new Error("Article not found");
      }
      return article;
    } catch (error) {
      throw error;
    }
  }

  async deleteArticle(articleId) {
    try {
      const article = await NewsArticle.findByIdAndDelete(articleId);
      if (!article) {
        throw new Error("Article not found");
      }
      return article;
    } catch (error) {
      throw error;
    }
  }

  async getArticlesByTag(tag) {
    try {
      const articles = await NewsArticle.find({
        tags: { $in: [tag] },
        publishedAt: { $lte: new Date() },
      })
        .sort({ publishedAt: -1 })
        .lean();
      return articles;
    } catch (error) {
      throw error;
    }
  }

  async searchArticles(searchTerm) {
    try {
      const articles = await NewsArticle.find({
        $and: [
          { publishedAt: { $lte: new Date() } },
          {
            $or: [
              { title: { $regex: searchTerm, $options: "i" } },
              { excerpt: { $regex: searchTerm, $options: "i" } },
              { content: { $regex: searchTerm, $options: "i" } },
              { tags: { $in: [new RegExp(searchTerm, "i")] } },
            ],
          },
        ],
      })
        .sort({ publishedAt: -1 })
        .lean();
      return articles;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new NewsService();
