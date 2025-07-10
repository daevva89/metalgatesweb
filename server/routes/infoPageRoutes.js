const express = require("express");
const router = express.Router();
const infoPageService = require("../services/infoPageService");
const auth = require("./middleware/auth");
const InfoPage = require("../models/InfoPage"); // Import model

// GET /api/infopage - Get info page content
router.get("/", async (req, res) => {
  try {
    const infoPage = await infoPageService.getInfoPage();
    res.json({ success: true, data: infoPage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// !!! TEMPORARY FIX ROUTE - DO NOT REMOVE !!!
router.get("/fix-guidelines", auth, async (req, res) => {
  try {
    const infoPage = await InfoPage.findOne();
    if (!infoPage) {
      return res.status(404).json({ message: "InfoPage not found." });
    }

    const guidelines = infoPage.rules.importantGuidelines;

    // Check if it's an array with one string element
    if (
      Array.isArray(guidelines) &&
      guidelines.length === 1 &&
      typeof guidelines[0] === "string"
    ) {
      const singleString = guidelines[0];
      const newArray = singleString
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line);

      infoPage.rules.importantGuidelines = newArray;
      await infoPage.save();

      return res.json({
        message: "Guidelines fixed successfully!",
        oldValue: guidelines,
        newValue: newArray,
      });
    }

    return res.json({
      message: "Guidelines already in correct format or not found.",
      currentValue: guidelines,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/infopage - Update info page content (admin only)
router.put("/", auth, async (req, res) => {
  try {
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
