const express = require("express");
const router = express.Router();
const userService = require("../services/userService");
const { generateTokens } = require("../utils/auth");
const jwt = require("jsonwebtoken");

// POST /api/auth/register - Register new user
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await userService.createUser({ email, password });

    const { accessToken, refreshToken } = generateTokens({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
        },
        accessToken,
        refreshToken,
      },
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/auth/login - Login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const user = await userService.validateUser(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password",
      });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Login failed",
    });
  }
});

// POST /api/auth/refresh - Refresh access token
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        error: "Refresh token is required",
      });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await userService.getUserById(decoded.id);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid refresh token",
        });
      }

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        generateTokens({
          id: user._id,
          email: user.email,
          role: user.role,
        });

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
          },
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        },
        message: "Token refreshed successfully",
      });
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: "Invalid refresh token",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/auth/me - Get current user info
router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "No authorization header provided",
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: "No token provided",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userService.getUserById(decoded.id);

      if (!user) {
        return res.status(401).json({
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
          },
        },
      });
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        error: "Invalid token",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/auth/logout - Logout user (for future implementation)
router.post("/logout", (req, res) => {
  // In a real implementation, you would invalidate the refresh token here
  // For now, just return success as the frontend will remove the tokens
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
