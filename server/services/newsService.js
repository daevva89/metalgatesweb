const NewsArticle = require('../models/NewsArticle');
const FileUploadUtil = require('../utils/fileUpload');
const ImageCleanupUtil = require('../utils/imageCleanup');

class NewsService {
  async createArticle(articleData) {
    try {
      console.log('NewsService: Creating new article');
      
      // Handle image upload if provided
      let imagePath = null;
      if (articleData.image) {
        console.log('NewsService: Processing article image upload');
        imagePath = await FileUploadUtil.saveBase64Image(articleData.image, 'news');
        console.log('NewsService: Article image saved successfully');
      }

      const article = new NewsArticle({
        title: articleData.title,
        excerpt: articleData.excerpt,
        content: articleData.content,
        image: imagePath,
        publishedAt: articleData.publishedAt || new Date()
      });

      const savedArticle = await article.save();
      console.log('NewsService: Article created successfully');
      
      // Convert image path to URL for response
      const response = savedArticle.toObject();
      if (response.image) {
        response.image = FileUploadUtil.getImageUrl(response.image);
      }
      
      return response;
    } catch (error) {
      console.error('NewsService: Error creating article:', error);
      throw error;
    }
  }

  async getAllArticles() {
    try {
      console.log('NewsService: Fetching all articles');
      const articles = await NewsArticle.find().sort({ publishedAt: -1 });
      console.log(`NewsService: Found ${articles.length} articles`);
      
      // Convert image paths to URLs
      const articlesWithUrls = articles.map(article => {
        const articleObj = article.toObject();
        if (articleObj.image) {
          articleObj.image = FileUploadUtil.getImageUrl(articleObj.image);
        }
        return articleObj;
      });
      
      return articlesWithUrls;
    } catch (error) {
      console.error('NewsService: Error fetching articles:', error);
      throw error;
    }
  }

  async getArticleById(articleId) {
    try {
      console.log('NewsService: Fetching article by ID:', articleId);
      const article = await NewsArticle.findById(articleId);
      
      if (!article) {
        throw new Error('Article not found');
      }

      console.log('NewsService: Article found');
      
      // Convert image path to URL
      const response = article.toObject();
      if (response.image) {
        response.image = FileUploadUtil.getImageUrl(response.image);
      }
      
      return response;
    } catch (error) {
      console.error('NewsService: Error fetching article:', error);
      throw error;
    }
  }

  async updateArticle(articleId, updateData) {
    try {
      console.log('NewsService: Updating article:', articleId);
      
      const existingArticle = await NewsArticle.findById(articleId);
      if (!existingArticle) {
        throw new Error('Article not found');
      }

      // Handle image update if provided
      let imagePath = existingArticle.image;
      if (updateData.image !== undefined) {
        if (updateData.image) {
          console.log('NewsService: Processing article image update');
          imagePath = await FileUploadUtil.saveBase64Image(updateData.image, 'news', existingArticle.image);
          console.log('NewsService: Article image updated successfully');
        } else {
          // Remove image
          if (existingArticle.image) {
            await ImageCleanupUtil.cleanupNewsImages(existingArticle);
          }
          imagePath = null;
          console.log('NewsService: Article image removed');
        }
      }

      const updatedArticle = await NewsArticle.findByIdAndUpdate(
        articleId,
        {
          title: updateData.title,
          excerpt: updateData.excerpt,
          content: updateData.content,
          image: imagePath,
          publishedAt: updateData.publishedAt || existingArticle.publishedAt
        },
        { new: true }
      );

      console.log('NewsService: Article updated successfully');
      
      // Convert image path to URL for response
      const response = updatedArticle.toObject();
      if (response.image) {
        response.image = FileUploadUtil.getImageUrl(response.image);
      }
      
      return response;
    } catch (error) {
      console.error('NewsService: Error updating article:', error);
      throw error;
    }
  }

  async deleteArticle(articleId) {
    try {
      console.log('NewsService: Deleting article:', articleId);
      
      const article = await NewsArticle.findById(articleId);
      if (!article) {
        throw new Error('Article not found');
      }

      // Clean up associated images
      await ImageCleanupUtil.cleanupNewsImages(article);

      await NewsArticle.findByIdAndDelete(articleId);
      console.log('NewsService: Article deleted successfully');
      
      return article;
    } catch (error) {
      console.error('NewsService: Error deleting article:', error);
      throw error;
    }
  }
}

module.exports = new NewsService();