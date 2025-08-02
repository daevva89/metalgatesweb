const express = require("express");
const router = express.Router();
const newsService = require("../services/newsService");
const auth = require("./middleware/auth");
const upload = require("../utils/upload");

// Get all news articles
router.get("/", async (req, res) => {
  try {
    const articles = await newsService.getAllArticles();
    res.json({
      success: true,
      data: { articles },
      message: "Articles fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get a specific news article by ID
router.get("/:id", async (req, res) => {
  try {
    const article = await newsService.getArticleById(req.params.id);
    res.json({
      success: true,
      data: { article },
      message: "Article fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create a new news article
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { title, content, excerpt, author, tags } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        error: "Title and content are required",
      });
    }

    const articleData = {
      title,
      content,
      excerpt,
      author,
      tags,
    };

    // Add image URL if file was uploaded
    if (req.file) {
      articleData.imageUrl = `/api/uploads/${req.file.filename}`;
    }

    const newArticle = await newsService.createArticle(articleData);

    res.status(201).json({
      success: true,
      data: { article: newArticle },
      message: "Article created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a news article
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, author, tags } = req.body;

    const updateData = {
      title,
      content,
      excerpt,
      author,
      tags,
    };

    // Add image URL if file was uploaded
    if (req.file) {
      updateData.imageUrl = `/api/uploads/${req.file.filename}`;
    }

    const updatedArticle = await newsService.updateArticle(id, updateData);

    res.json({
      success: true,
      data: { article: updatedArticle },
      message: "Article updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a news article
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedArticle = await newsService.deleteArticle(req.params.id);

    if (!deletedArticle) {
      return res.status(404).json({
        success: false,
        error: "Article not found",
      });
    }

    res.json({
      success: true,
      data: { article: deletedArticle },
      message: "Article deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
