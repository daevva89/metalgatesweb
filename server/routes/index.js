const express = require("express");
const router = express.Router();

// Health check endpoint
router.get("/ping", (req, res) => {
  res.status(200).json({
    status: "OK",
    service: "Metal Gates Festival API",
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
