const express = require("express");
const router = express.Router();
const infoPageService = require("../services/infoPageService");
const auth = require("./middleware/auth");

// GET /api/infopage - Get info page content
router.get("/", async (req, res) => {
  try {
    const infoPage = await infoPageService.getInfoPage();
    res.json({ success: true, data: infoPage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/infopage - Update info page content (admin only)
router.put("/", auth, async (req, res) => {
  try {
    // Server-side fix for client data issue
    if (
      req.body.rules &&
      typeof req.body.rules.importantGuidelines === "string"
    ) {
      req.body.rules.importantGuidelines =
        req.body.rules.importantGuidelines.split("\n");
    }

    const infoPage = await infoPageService.updateInfoPage(req.body);
    res.json({
      success: true,
      data: infoPage,
      message: "Info page updated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
