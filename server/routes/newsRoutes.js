const express = require('express');
const router = express.Router();
const newsService = require('../services/newsService');
const auth = require('./middleware/auth');

// GET /api/news - Get all articles
router.get('/', async (req, res) => {
  console.log('GET /api/news - Fetching all articles');
  try {
    const articles = await newsService.getAllArticles();
    console.log(`GET /api/news - Successfully fetched ${articles.length} articles`);
    res.json({
      success: true,
      data: { articles },
      message: 'Articles fetched successfully'
    });
  } catch (error) {
    console.error('GET /api/news - Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/news/:id - Get single article
router.get('/:id', async (req, res) => {
  console.log('GET /api/news/:id - Fetching article with ID:', req.params.id);
  try {
    const article = await newsService.getArticleById(req.params.id);
    console.log('GET /api/news/:id - Successfully fetched article:', article.title);
    res.json({
      success: true,
      data: { article },
      message: 'Article fetched successfully'
    });
  } catch (error) {
    console.error('GET /api/news/:id - Error:', error.message);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/news - Create new article (admin only)
router.post('/', auth, async (req, res) => {
  console.log('POST /api/news - Creating new article by user:', req.user.email);
  console.log('POST /api/news - Request body received:', JSON.stringify(req.body, null, 2));
  console.log('POST /api/news - Request body type:', typeof req.body);
  console.log('POST /api/news - Request body keys:', Object.keys(req.body || {}));
  
  try {
    const { title, excerpt, content, image, publishedAt } = req.body;

    console.log('POST /api/news - Extracted fields:', {
      title: title,
      excerpt: excerpt,
      content: content ? 'present' : 'missing',
      image: image ? 'present' : 'missing',
      publishedAt: publishedAt ? 'present' : 'missing'
    });

    if (!title || !excerpt || !content) {
      console.log('POST /api/news - Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Title, excerpt, and content are required'
      });
    }

    const articleData = {
      title,
      excerpt,
      content,
      image: image || '',
      publishedAt: publishedAt ? new Date(publishedAt) : new Date()
    };

    console.log('POST /api/news - Article data to save:', JSON.stringify(articleData, null, 2));

    const article = await newsService.createArticle(articleData);
    console.log('POST /api/news - Article created successfully:', article.title);
    res.status(201).json({
      success: true,
      data: { article },
      message: 'Article created successfully'
    });
  } catch (error) {
    console.error('POST /api/news - Error:', error.message);
    console.error('POST /api/news - Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/news/:id - Update article (admin only)
router.put('/:id', auth, async (req, res) => {
  console.log('PUT /api/news/:id - Updating article with ID:', req.params.id);
  console.log('PUT /api/news/:id - Request body received:', JSON.stringify(req.body, null, 2));
  
  try {
    const { title, excerpt, content, image, publishedAt } = req.body;

    const updateData = {
      title,
      excerpt,
      content,
      image: image || '',
      publishedAt: publishedAt ? new Date(publishedAt) : undefined
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    console.log('PUT /api/news/:id - Update data:', JSON.stringify(updateData, null, 2));

    const article = await newsService.updateArticle(req.params.id, updateData);
    console.log('PUT /api/news/:id - Article updated successfully:', article.title);
    res.json({
      success: true,
      data: { article },
      message: 'Article updated successfully'
    });
  } catch (error) {
    console.error('PUT /api/news/:id - Error:', error.message);
    console.error('PUT /api/news/:id - Error stack:', error.stack);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/news/:id - Delete article (admin only)
router.delete('/:id', auth, async (req, res) => {
  console.log('DELETE /api/news/:id - Deleting article with ID:', req.params.id);
  try {
    const article = await newsService.deleteArticle(req.params.id);
    console.log('DELETE /api/news/:id - Article deleted successfully:', article.title);
    res.json({
      success: true,
      data: { article },
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('DELETE /api/news/:id - Error:', error.message);
    console.error('DELETE /api/news/:id - Error stack:', error.stack);
    const statusCode = error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;