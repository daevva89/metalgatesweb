const express = require("express");
const router = express.Router();
const visitService = require("../services/visitService");
const auth = require("./middleware/auth");

// POST /api/visits/log - Log a new visit
router.post("/log", async (req, res) => {
  try {
    // We can get the IP from the request object.
    // 'x-forwarded-for' is for when behind a proxy.
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    await visitService.logVisit({ ip });
    res.status(201).json({ success: true, message: "Visit logged." });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to log visit." });
  }
});

// GET /api/visits/stats - Get visitor statistics (admin only)
router.get("/stats", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, error: "Access denied." });
    }
    const stats = await visitService.getVisitStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
