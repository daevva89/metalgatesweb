const express = require("express");
const router = express.Router();
const archiveService = require("../services/archiveService");
const auth = require("./middleware/auth");
const upload = require("../utils/upload");

// GET /api/archives - Get all archives
router.get("/", async (req, res) => {
  try {
    const archives = await archiveService.getAllArchives();
      `GET /api/archives - Successfully fetched ${archives.length} archives`
    );
    res.json({
      success: true,
      data: { archives },
      message: "Archives fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/archives - Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/archives/:id - Get single archive
router.get("/:id", async (req, res) => {
    "GET /api/archives/:id - Fetching archive with ID:",
    req.params.id
  );
  try {
    const archive = await archiveService.getArchiveById(req.params.id);
      "GET /api/archives/:id - Successfully fetched archive for year:",
      archive.year
    );
    res.json({
      success: true,
      data: { archive },
      message: "Archive fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/archives/:id - Error:", error.message);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/archives - Create new archive (admin only)
router.post("/", auth, upload.single("poster"), async (req, res) => {
  try {
    const archiveData = { ...req.body };

    if (req.file) {
      archiveData.poster = `/api/uploads/${req.file.filename}`;
    }

    const archive = await archiveService.createArchive(archiveData);
    res.status(201).json({
      success: true,
      data: { archive },
      message: "Archive created successfully",
    });
  } catch (error) {
    console.error("POST /api/archives - Error:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/archives/:id - Update archive (admin only)
router.put("/:id", auth, upload.single("poster"), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.poster = `/api/uploads/${req.file.filename}`;
    }

    const archive = await archiveService.updateArchive(
      req.params.id,
      updateData
    );
    res.json({
      success: true,
      data: { archive },
      message: "Archive updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/archives/:id - Error:", error.message);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({ success: false, error: error.message });
  }
});

// DELETE /api/archives/:id - Delete archive (admin only)
router.delete("/:id", auth, async (req, res) => {
    "DELETE /api/archives/:id - Deleting archive with ID:",
    req.params.id
  );
  try {
    const archive = await archiveService.deleteArchive(req.params.id);
      "DELETE /api/archives/:id - Archive deleted successfully for year:",
      archive.year
    );
    res.json({
      success: true,
      data: { archive },
      message: "Archive deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/archives/:id - Error:", error.message);
    console.error("DELETE /api/archives/:id - Error stack:", error.stack);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
