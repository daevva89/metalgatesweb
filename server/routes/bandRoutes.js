const express = require("express");
const router = express.Router();
const bandService = require("../services/bandService");
const auth = require("./middleware/auth");
const upload = require("../utils/upload");

// GET /api/lineup - Get all bands
router.get("/", async (req, res) => {
  try {
    const bands = await bandService.getAllBands();

    res.json({
      success: true,
      bands,
      message: `Successfully retrieved ${bands.length} bands`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "There was an error fetching the bands.",
    });
  }
});

// GET /api/lineup/:id - Get single band
router.get("/:id", async (req, res) => {
  try {
    const band = await bandService.getBandById(req.params.id);

    if (!band) {
      return res.status(404).json({
        success: false,
        error: "Band not found",
      });
    }

    res.json({
      success: true,
      band,
      message: "Band retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "There was an error fetching the band.",
    });
  }
});

// POST /api/lineup - Create new band (admin only)
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const { name, country, biography, ...otherData } = req.body;

    if (!name || !country || !biography) {
      return res.status(400).json({
        success: false,
        error: "Name, country, and biography are required",
      });
    }

    const bandData = {
      name,
      country,
      biography,
      genre: otherData.genre,
      spotifyEmbed: otherData.spotifyEmbed,
      socialLinks: {
        facebook: otherData.facebook,
        instagram: otherData.instagram,
        youtube: otherData.youtube,
        tiktok: otherData.tiktok,
        bandcamp: otherData.bandcamp,
        website: otherData.website,
      },
    };

    if (req.file) {
      bandData.image = `/api/uploads/${req.file.filename}`;
    }

    const band = await bandService.createBand(bandData);
    res.status(201).json({
      success: true,
      data: { band },
      message: "Band created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/lineup/:id - Update band (admin only)
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const { ...updateData } = req.body;

    if (req.file) {
      updateData.image = `/api/uploads/${req.file.filename}`;
    }

    const band = await bandService.updateBand(req.params.id, updateData);
    res.json({
      success: true,
      data: { band },
      message: "Band updated successfully",
    });
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/lineup/:id - Delete band (admin only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const band = await bandService.deleteBand(req.params.id);
    res.json({
      success: true,
      data: { band },
      message: "Band deleted successfully",
    });
  } catch (error) {
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
