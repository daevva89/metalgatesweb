const { randomUUID } = require('crypto');

const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');

class UserService {
  async createUser(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      const hashedPassword = await hashPassword(userData.password);

      const user = new User({
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'user'
      });

      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      console.error('UserService: Error creating user:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      console.error('UserService: Error getting user by ID:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      console.error('UserService: Error getting user by email:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await User.find({}, '-password -refreshToken');
      return users;
    } catch (error) {
      console.error('UserService: Error getting all users:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('UserService: Error updating user:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('UserService: Error deleting user:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async authenticateUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid credentials');
      }

      return user;
    } catch (error) {
      console.error('UserService: Error during authentication:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }
}

module.exports = new UserService();