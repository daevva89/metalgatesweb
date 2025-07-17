const express = require("express");
const router = express.Router();
const festivalService = require("../services/festivalService");
const auth = require("./middleware/auth");

// Get all festivals
router.get("/", async (req, res) => {
  try {
    const festivals = await festivalService.getAllFestivals();
    res.json({
      success: true,
      data: { festivals },
      message: "Festivals fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get active festival
router.get("/active", async (req, res) => {
  try {
    const festival = await festivalService.getActiveFestival();
    res.json({
      success: true,
      data: { festival },
      message: "Active festival fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get a specific festival by ID
router.get("/:id", async (req, res) => {
  try {
    const festival = await festivalService.getFestivalById(req.params.id);
    res.json({
      success: true,
      data: { festival },
      message: "Festival fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Create a new festival
router.post("/", auth, async (req, res) => {
  try {
    const { name, year, dates, description, lineup, isActive } = req.body;

    if (!name || !year) {
      return res.status(400).json({
        success: false,
        error: "Name and year are required",
      });
    }

    const newFestival = await festivalService.createFestival({
      name,
      year,
      dates,
      description,
      lineup,
      isActive,
    });

    res.status(201).json({
      success: true,
      data: { festival: newFestival },
      message: "Festival created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Update a festival
router.put("/:id", auth, async (req, res) => {
  try {
    const { name, year, dates, description, lineup, isActive } = req.body;

    const updatedFestival = await festivalService.updateFestival(
      req.params.id,
      {
        name,
        year,
        dates,
        description,
        lineup,
        isActive,
      }
    );

    if (!updatedFestival) {
      return res.status(404).json({
        success: false,
        error: "Festival not found",
      });
    }

    res.json({
      success: true,
      data: { festival: updatedFestival },
      message: "Festival updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Delete a festival
router.delete("/:id", auth, async (req, res) => {
  try {
    const deletedFestival = await festivalService.deleteFestival(req.params.id);

    if (!deletedFestival) {
      return res.status(404).json({
        success: false,
        error: "Festival not found",
      });
    }

    res.json({
      success: true,
      data: { festival: deletedFestival },
      message: "Festival deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Set festival as active
router.patch("/:id/activate", async (req, res) => {
  try {
    const activatedFestival = await festivalService.setActiveFestival(
      req.params.id
    );

    if (!activatedFestival) {
      return res.status(404).json({
        success: false,
        error: "Festival not found",
      });
    }

    res.json({
      success: true,
      data: { festival: activatedFestival },
      message: "Festival activated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
