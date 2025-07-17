const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const auth = require('./middleware/auth');

// POST /api/users - Create a new user (admin only)
router.post('/', auth, async (req, res) => {

  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const userData = {
      email,
      password,
      role: role || 'user'
    };

    const user = await userService.createUser(userData);

    res.status(201).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt
        }
      },
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('POST /api/users - Error creating user:', error.message);
    console.error('POST /api/users - Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/users/me - Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
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
          role: user.role,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt
        }
      },
      message: 'User profile retrieved successfully'
    });
  } catch (error) {
    console.error('GET /api/users/me - Error getting user profile:', error.message);
    console.error('GET /api/users/me - Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/users - Get all users (admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const users = await userService.getAllUsers();
    
    res.json({
      success: true,
      data: { users },
      message: 'Users retrieved successfully'
    });
  } catch (error) {
    console.error('GET /api/users - Error getting users:', error.message);
    console.error('GET /api/users - Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;