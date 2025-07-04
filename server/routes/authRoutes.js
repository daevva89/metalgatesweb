const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { generateTokens } = require('../utils/auth');
const jwt = require('jsonwebtoken');

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
  console.log('POST /api/auth/register - Registration attempt started');
  console.log('POST /api/auth/register - Request body:', JSON.stringify(req.body, null, 2));
  console.log('POST /api/auth/register - Request body type:', typeof req.body);
  console.log('POST /api/auth/register - Request body keys:', Object.keys(req.body || {}));

  try {
    const { email, password } = req.body;

    console.log('POST /api/auth/register - Extracted fields:', {
      email: email ? 'present' : 'missing',
      password: password ? 'present' : 'missing'
    });

    if (!email || !password) {
      console.log('POST /api/auth/register - Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    console.log('POST /api/auth/register - Creating user with email:', email);
    const user = await userService.createUser({ email, password });
    console.log('POST /api/auth/register - User created successfully with ID:', user._id);

    console.log('POST /api/auth/register - Generating tokens for user');
    const { accessToken } = generateTokens(user);
    console.log('POST /api/auth/register - Tokens generated successfully');

    console.log('POST /api/auth/register - Registration successful, sending response');
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
  console.log('POST /api/auth/login - Login attempt started');
  console.log('POST /api/auth/login - Request body:', JSON.stringify(req.body, null, 2));
  console.log('POST /api/auth/login - Request body type:', typeof req.body);
  console.log('POST /api/auth/login - Request body keys:', Object.keys(req.body || {}));

  try {
    const { email, password } = req.body;

    console.log('POST /api/auth/login - Extracted fields:', {
      email: email ? 'present' : 'missing',
      password: password ? 'present' : 'missing'
    });

    if (!email || !password) {
      console.log('POST /api/auth/login - Missing required fields');
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    console.log('POST /api/auth/login - Attempting to authenticate user with email:', email);
    const user = await userService.authenticateUser(email, password);
    console.log('POST /api/auth/login - User authenticated successfully with ID:', user._id);

    console.log('POST /api/auth/login - About to call generateTokens function');
    console.log('POST /api/auth/login - generateTokens type:', typeof generateTokens);
    console.log('POST /api/auth/login - generateTokens function:', generateTokens);

    const { accessToken, refreshToken } = generateTokens(user);
    console.log('POST /api/auth/login - Tokens generated successfully');

    console.log('POST /api/auth/login - Updating user with refresh token and last login');
    await userService.updateUser(user._id, {
      refreshToken,
      lastLoginAt: new Date()
    });
    console.log('POST /api/auth/login - User updated successfully');

    console.log('POST /api/auth/login - Login successful, sending response');
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
  console.log('POST /api/auth/refresh - Token refresh attempt');
  console.log('POST /api/auth/refresh - Request body:', JSON.stringify(req.body, null, 2));

  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      console.log('POST /api/auth/refresh - No refresh token provided');
      return res.status(401).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    console.log('POST /api/auth/refresh - Refresh token:', refreshToken ? 'present' : 'missing');

    console.log('POST /api/auth/refresh - Verifying refresh token');
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);
    console.log('POST /api/auth/refresh - Refresh token verified for user:', decoded.userId);

    console.log('POST /api/auth/refresh - Fetching user by ID:', decoded.userId);
    const user = await userService.getUserById(decoded.userId);

    if (!user) {
      console.log('POST /api/auth/refresh - User not found');
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }

    console.log('POST /api/auth/refresh - Generating new tokens');
    const tokens = generateTokens(user);
    console.log('POST /api/auth/refresh - New tokens generated');

    console.log('POST /api/auth/refresh - Updating user with new refresh token');
    await userService.updateUser(user._id, {
      refreshToken: tokens.refreshToken
    });
    console.log('POST /api/auth/refresh - User updated with new refresh token');

    console.log('POST /api/auth/refresh - Token refresh successful');
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
  console.log('GET /api/auth/me - Get current user attempt');
  
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.log('GET /api/auth/me - No authorization header');
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      console.log('GET /api/auth/me - No token in authorization header');
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    console.log('GET /api/auth/me - Verifying token');
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET);
    console.log('GET /api/auth/me - Token verified for user:', decoded.userId);

    console.log('GET /api/auth/me - Fetching user by ID:', decoded.userId);
    const user = await userService.getUserById(decoded.userId);

    if (!user) {
      console.log('GET /api/auth/me - User not found');
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('GET /api/auth/me - User found, sending response');
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
  console.log('POST /api/auth/logout - Logout attempt');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

module.exports = router;