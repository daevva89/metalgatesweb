const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const auth = require('./middleware/auth');

// POST /api/users - Create a new user (admin only)
router.post('/', auth, async (req, res) => {
  console.log('POST /api/users - Creating new user by admin:', req.user.email);
  console.log('POST /api/users - Request body:', JSON.stringify(req.body, null, 2));

  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      console.log('POST /api/users - Missing required fields');
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

    console.log('POST /api/users - Creating user with data:', { email, role: userData.role });
    const user = await userService.createUser(userData);
    console.log('POST /api/users - User created successfully with ID:', user._id);

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
  console.log('GET /api/users/me - Getting current user profile for:', req.user.email);
  try {
    const user = await userService.getUserById(req.user._id);
    
    if (!user) {
      console.log('GET /api/users/me - User not found with ID:', req.user._id);
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    console.log('GET /api/users/me - User profile retrieved successfully');
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
  console.log('GET /api/users - Getting all users by admin:', req.user.email);
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      console.log('GET /api/users - Access denied, user is not admin');
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    const users = await userService.getAllUsers();
    console.log(`GET /api/users - Successfully retrieved ${users.length} users`);
    
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