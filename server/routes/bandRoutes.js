const express = require("express");
const router = express.Router();
const bandService = require("../services/bandService");
const auth = require("./middleware/auth");
const upload = require("../utils/upload");

// GET /api/lineup - Get all bands
router.get("/", async (req, res) => {
  console.log("GET /api/lineup - Fetching all bands");
  try {
    const bands = await bandService.getAllBands();
    console.log(`GET /api/lineup - Successfully fetched ${bands.length} bands`);

    // Log image data for each band
    bands.forEach((band, index) => {
      console.log(`GET /api/lineup - Band ${index + 1} (${band.name}):`, {
        _id: band._id,
        name: band.name,
        hasImage: !!band.image,
        imageLength: band.image ? band.image.length : 0,
        imagePreview: band.image
          ? band.image.substring(0, 50) + "..."
          : "no image",
      });
    });

    res.json({
      success: true,
      data: { bands },
      message: "Bands fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/lineup - Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/lineup/:id - Get single band
router.get("/:id", async (req, res) => {
  console.log("GET /api/lineup/:id - Fetching band with ID:", req.params.id);
  try {
    const band = await bandService.getBandById(req.params.id);
    console.log("GET /api/lineup/:id - Successfully fetched band:", band.name);
    res.json({
      success: true,
      data: { band },
      message: "Band fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/lineup/:id - Error:", error.message);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/lineup - Create new band (admin only)
router.post("/", auth, upload.single("image"), async (req, res) => {
  console.log("POST /api/lineup - Creating new band by user:", req.user.email);
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
    console.error("POST /api/lineup - Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/lineup/:id - Update band (admin only)
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  console.log("PUT /api/lineup/:id - Updating band with ID:", req.params.id);
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
    console.error("PUT /api/lineup/:id - Error:", error.message);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/lineup/:id - Delete band (admin only)
router.delete("/:id", auth, async (req, res) => {
  console.log("DELETE /api/lineup/:id - Deleting band with ID:", req.params.id);
  try {
    const band = await bandService.deleteBand(req.params.id);
    console.log(
      "DELETE /api/lineup/:id - Band deleted successfully:",
      band.name
    );
    res.json({
      success: true,
      data: { band },
      message: "Band deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/lineup/:id - Error:", error.message);
    console.error("DELETE /api/lineup/:id - Error stack:", error.stack);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
