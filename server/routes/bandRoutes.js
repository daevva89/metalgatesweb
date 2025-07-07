const express = require("express");
const router = express.Router();
const bandService = require("../services/bandService");
const auth = require("./middleware/auth");

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
router.post("/", auth, async (req, res) => {
  console.log("POST /api/lineup - Creating new band by user:", req.user.email);
  console.log(
    "POST /api/lineup - Request body received:",
    JSON.stringify(req.body, null, 2)
  );
  console.log("POST /api/lineup - Request body type:", typeof req.body);
  console.log(
    "POST /api/lineup - Request body keys:",
    Object.keys(req.body || {})
  );

  try {
    const {
      name,
      country,
      genre,
      image,
      biography,
      spotifyEmbed,
      facebook,
      instagram,
      youtube,
      tiktok,
      bandcamp,
      website,
    } = req.body;

    console.log("POST /api/lineup - Extracted fields:", {
      name: name,
      country: country,
      genre: genre ? "present" : "missing",
      image: image ? `present (${image.length} chars)` : "missing",
      biography: biography ? "present" : "missing",
      spotifyEmbed: spotifyEmbed ? "present" : "missing",
      facebook: facebook ? "present" : "missing",
      instagram: instagram ? "present" : "missing",
      youtube: youtube ? "present" : "missing",
      tiktok: tiktok ? "present" : "missing",
      bandcamp: bandcamp ? "present" : "missing",
      website: website ? "present" : "missing",
    });

    if (!name || !country || !biography) {
      console.log("POST /api/lineup - Missing required fields");
      return res.status(400).json({
        success: false,
        error: "Name, country, and biography are required",
      });
    }

    const bandData = {
      name,
      country,
      genre: genre || "",
      image: image || "",
      biography,
      spotifyEmbed: spotifyEmbed || "",
      facebook: facebook || "",
      instagram: instagram || "",
      youtube: youtube || "",
      tiktok: tiktok || "",
      bandcamp: bandcamp || "",
      website: website || "",
    };

    console.log("POST /api/lineup - Band data to save:", {
      ...bandData,
      image: bandData.image
        ? `base64 data (${bandData.image.length} chars)`
        : "no image",
      socialLinks: bandData.socialLinks,
    });

    const band = await bandService.createBand(bandData);
    console.log("POST /api/lineup - Band created successfully:", band.name);
    console.log("POST /api/lineup - Created band image info:", {
      hasImage: !!band.image,
      imageLength: band.image ? band.image.length : 0,
    });

    res.status(201).json({
      success: true,
      data: { band },
      message: "Band created successfully",
    });
  } catch (error) {
    console.error("POST /api/lineup - Error:", error.message);
    console.error("POST /api/lineup - Error stack:", error.stack);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/lineup/:id - Update band (admin only)
router.put("/:id", auth, async (req, res) => {
  console.log("PUT /api/lineup/:id - Updating band with ID:", req.params.id);
  console.log(
    "PUT /api/lineup/:id - Request body received:",
    JSON.stringify(req.body, null, 2)
  );

  try {
    const {
      name,
      country,
      genre,
      image,
      biography,
      spotifyEmbed,
      facebook,
      instagram,
      youtube,
      tiktok,
      bandcamp,
      website,
    } = req.body;

    console.log("PUT /api/lineup/:id - Extracted fields:", {
      name: name,
      country: country,
      genre: genre ? "present" : "missing",
      image: image ? `present (${image.length} chars)` : "missing",
      biography: biography ? "present" : "missing",
      spotifyEmbed: spotifyEmbed ? "present" : "missing",
      facebook: facebook ? "present" : "missing",
      instagram: instagram ? "present" : "missing",
      youtube: youtube ? "present" : "missing",
      tiktok: tiktok ? "present" : "missing",
      bandcamp: bandcamp ? "present" : "missing",
      website: website ? "present" : "missing",
    });

    const updateData = {
      name,
      country,
      genre: genre || "",
      image: image || "",
      biography,
      spotifyEmbed: spotifyEmbed || "",
      facebook: facebook || "",
      instagram: instagram || "",
      youtube: youtube || "",
      tiktok: tiktok || "",
      bandcamp: bandcamp || "",
      website: website || "",
    };

    console.log("PUT /api/lineup/:id - Update data:", {
      ...updateData,
      image: updateData.image
        ? `base64 data (${updateData.image.length} chars)`
        : "no image",
      socialLinks: updateData.socialLinks,
    });

    const band = await bandService.updateBand(req.params.id, updateData);
    console.log("PUT /api/lineup/:id - Band updated successfully:", band.name);
    console.log("PUT /api/lineup/:id - Updated band image info:", {
      hasImage: !!band.image,
      imageLength: band.image ? band.image.length : 0,
    });

    res.json({
      success: true,
      data: { band },
      message: "Band updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/lineup/:id - Error:", error.message);
    console.error("PUT /api/lineup/:id - Error stack:", error.stack);
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
