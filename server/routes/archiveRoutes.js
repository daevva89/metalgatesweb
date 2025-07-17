const express = require("express");
const router = express.Router();
const archiveService = require("../services/archiveService");
const auth = require("./middleware/auth");
const upload = require("../utils/upload");

// Get all archive entries
router.get("/", async (req, res) => {
  try {
    const archives = await archiveService.getAllArchives();
    res.json({
      success: true,
      data: { archives },
      message: "Archives fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get a specific archive entry by ID
router.get("/:id", async (req, res) => {
  try {
    const archive = await archiveService.getArchiveById(req.params.id);
    res.json({
      success: true,
      data: { archive },
      message: "Archive fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create a new archive entry
router.post("/", auth, upload.single("poster"), async (req, res) => {
  try {
    const { year, title, description, imageUrl, lineup, dates } = req.body;

    if (!year || !title) {
      return res.status(400).json({
        success: false,
        error: "Year and title are required",
      });
    }

    const newArchive = await archiveService.createArchive({
      year,
      title,
      description,
      imageUrl,
      lineup,
      dates,
    });

    res.status(201).json({
      success: true,
      data: { archive: newArchive },
      message: "Archive created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update an archive entry
router.put("/:id", auth, upload.single("poster"), async (req, res) => {
  try {
    const { year, title, description, imageUrl, lineup, dates } = req.body;

    const updatedArchive = await archiveService.updateArchive(req.params.id, {
      year,
      title,
      description,
      imageUrl,
      lineup,
      dates,
    });

    if (!updatedArchive) {
      return res.status(404).json({
        success: false,
        error: "Archive not found",
      });
    }

    res.json({
      success: true,
      data: { archive: updatedArchive },
      message: "Archive updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete an archive entry
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedArchive = await archiveService.deleteArchive(req.params.id);

    if (!deletedArchive) {
      return res.status(404).json({
        success: false,
        error: "Archive not found",
      });
    }

    res.json({
      success: true,
      data: { archive: deletedArchive },
      message: "Archive deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
