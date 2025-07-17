const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const auth = require("./middleware/auth");

// Create admin user (POST /api/users/admin)
router.post("/admin", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    // Check if admin already exists
    const existingAdmin = await userService.getUserByEmail(email);
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        error: "User with this email already exists",
      });
    }

    // Create admin user
    const adminUser = await userService.createUser({
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: adminUser._id,
          email: adminUser.email,
          role: adminUser.role,
        },
      },
      message: "Admin user created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get current user profile (GET /api/users/me)
router.get("/me", auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      message: "User profile retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all users (admin only) (GET /api/users)
router.get("/", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin privileges required.",
      });
    }

    const users = await userService.getAllUsers();

    res.json({
      success: true,
      data: {
        users: users.map((user) => ({
          id: user._id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
        })),
      },
      message: "Users retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
