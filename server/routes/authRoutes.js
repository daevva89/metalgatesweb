const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { generateTokens } = require('../utils/auth');
const jwt = require('jsonwebtoken');

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {

  try {
    const { email, password } = req.body;

      email: email ? 'present' : 'missing',
      password: password ? 'present' : 'missing'
    });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const user = await userService.createUser({ email, password });

    const { accessToken } = generateTokens(user);

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role
        },
        accessToken
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('POST /api/auth/register - Error during registration:', error.message);
    console.error('POST /api/auth/register - Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;

      email: email ? 'present' : 'missing',
      password: password ? 'present' : 'missing'
    });

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const user = await userService.authenticateUser(email, password);


    const { accessToken, refreshToken } = generateTokens(user);

    await userService.updateUser(user._id, {
      refreshToken,
      lastLoginAt: new Date()
    });

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role
        },
        accessToken,
        refreshToken
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('POST /api/auth/login - Error during login:', error.message);
    console.error('POST /api/auth/login - Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', async (req, res) => {

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required'
      });
    }


    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

    const user = await userService.getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    const tokens = generateTokens(user);

    await userService.updateUser(user._id, {
      refreshToken: tokens.refreshToken
    });

    res.json({
      success: true,
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('POST /api/auth/refresh - Error during token refresh:', error.message);
    console.error('POST /api/auth/refresh - Error stack:', error.stack);
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', async (req, res) => {
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);

    const user = await userService.getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role
        }
      },
      message: 'User retrieved successfully'
    });
  } catch (error) {
    console.error('GET /api/auth/me - Error:', error.message);
    res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;