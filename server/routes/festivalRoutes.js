const express = require("express");
const router = express.Router();
const festivalService = require("../services/festivalService");
const auth = require("./middleware/auth");

// GET /api/festivals - Get all festivals
router.get("/", async (req, res) => {
  try {
    const festivals = await festivalService.getAllFestivals();
      `GET /api/festivals - Successfully fetched ${festivals.length} festivals`
    );
    res.json({
      success: true,
      data: { festivals },
      message: "Festivals fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/festivals - Error:", error.message);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/festivals/active - Get active festival info
router.get("/active", async (req, res) => {
  try {
    const festival = await festivalService.getActiveFestival();
      "GET /api/festivals/active - Successfully fetched active festival:",
      festival.name
    );

    // Calculate countdown (mock for now - in real app this would be calculated based on actual dates)
    const countdown = {
      days: 45,
      hours: 12,
      minutes: 30,
      seconds: 15,
    };

    const festivalInfo = {
      festivalName: festival.name,
      dates: festival.dates,
      location: festival.location,
      ticketUrl: festival.ticketUrl,
      countdown: countdown,
    };

      "GET /api/festivals/active - Sending festival info:",
      JSON.stringify(festivalInfo, null, 2)
    );

    res.json({
      success: true,
      data: festivalInfo,
      message: "Active festival info fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/festivals/active - Error:", error.message);
    res.status(404).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/festivals/:id - Get single festival
router.get("/:id", async (req, res) => {
    "GET /api/festivals/:id - Fetching festival with ID:",
    req.params.id
  );
  try {
    const festival = await festivalService.getFestivalById(req.params.id);
      "GET /api/festivals/:id - Successfully fetched festival:",
      festival.name
    );
    res.json({
      success: true,
      data: { festival },
      message: "Festival fetched successfully",
    });
  } catch (error) {
    console.error("GET /api/festivals/:id - Error:", error.message);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/festivals - Create new festival (admin only)
router.post("/", auth, async (req, res) => {
    "POST /api/festivals - Creating new festival by user:",
    req.user.email
  );
    "POST /api/festivals - Request body received:",
    JSON.stringify(req.body, null, 2)
  );

  try {
    const { name, dates, description, location, ticketUrl, isActive } =
      req.body;

      name: name,
      dates: dates,
      description: description ? "present" : "missing",
      location: location,
      ticketUrl: ticketUrl || "not provided",
      isActive: isActive !== undefined ? isActive : "default (true)",
    });

    if (!name || !dates || !description || !location) {
      return res.status(400).json({
        success: false,
        error: "Name, dates, description, and location are required",
      });
    }

    const festivalData = {
      name,
      dates,
      description,
      location,
      ticketUrl: ticketUrl || "",
      isActive: isActive !== undefined ? isActive : true,
    };

      "POST /api/festivals - Festival data to save:",
      JSON.stringify(festivalData, null, 2)
    );

    const festival = await festivalService.createFestival(festivalData);
      "POST /api/festivals - Festival created successfully:",
      festival.name
    );
    res.status(201).json({
      success: true,
      data: { festival },
      message: "Festival created successfully",
    });
  } catch (error) {
    console.error("POST /api/festivals - Error:", error.message);
    console.error("POST /api/festivals - Error stack:", error.stack);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/festivals/:id - Update festival (admin only)
router.put("/:id", auth, async (req, res) => {
    "PUT /api/festivals/:id - Updating festival with ID:",
    req.params.id
  );
    "PUT /api/festivals/:id - Request body received:",
    JSON.stringify(req.body, null, 2)
  );

  try {
    const { name, dates, description, location, ticketUrl, isActive } =
      req.body;

    const updateData = {
      name,
      dates,
      description,
      location,
      ticketUrl: ticketUrl || "",
      isActive: isActive !== undefined ? isActive : true,
    };

      "PUT /api/festivals/:id - Update data:",
      JSON.stringify(updateData, null, 2)
    );

    const festival = await festivalService.updateFestival(
      req.params.id,
      updateData
    );
      "PUT /api/festivals/:id - Festival updated successfully:",
      festival.name
    );
    res.json({
      success: true,
      data: { festival },
      message: "Festival updated successfully",
    });
  } catch (error) {
    console.error("PUT /api/festivals/:id - Error:", error.message);
    console.error("PUT /api/festivals/:id - Error stack:", error.stack);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/festivals/:id - Delete festival (admin only)
router.delete("/:id", auth, async (req, res) => {
    "DELETE /api/festivals/:id - Deleting festival with ID:",
    req.params.id
  );
  try {
    const festival = await festivalService.deleteFestival(req.params.id);
      "DELETE /api/festivals/:id - Festival deleted successfully:",
      festival.name
    );
    res.json({
      success: true,
      data: { festival },
      message: "Festival deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/festivals/:id - Error:", error.message);
    console.error("DELETE /api/festivals/:id - Error stack:", error.stack);
    const statusCode = error.message.includes("not found") ? 404 : 500;
    res.status(statusCode).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
