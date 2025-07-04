const { randomUUID } = require('crypto');

const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/password');

class UserService {
  async createUser(userData) {
    console.log('UserService: Creating user with email:', userData.email);
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        console.log('UserService: User already exists with email:', userData.email);
        throw new Error('User already exists with this email');
      }

      console.log('UserService: Hashing password');
      const hashedPassword = await hashPassword(userData.password);
      console.log('UserService: Password hashed successfully');

      const user = new User({
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'user'
      });

      console.log('UserService: Saving user to database');
      const savedUser = await user.save();
      console.log('UserService: User saved successfully with ID:', savedUser._id);
      return savedUser;
    } catch (error) {
      console.error('UserService: Error creating user:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async getUserById(userId) {
    console.log('UserService: Getting user by ID:', userId);
    try {
      const user = await User.findById(userId);
      if (!user) {
        console.log('UserService: User not found with ID:', userId);
        return null;
      }
      console.log('UserService: User found with email:', user.email);
      return user;
    } catch (error) {
      console.error('UserService: Error getting user by ID:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async getUserByEmail(email) {
    console.log('UserService: Getting user by email:', email);
    try {
      const user = await User.findOne({ email });
      if (!user) {
        console.log('UserService: User not found with email:', email);
        return null;
      }
      console.log('UserService: User found with ID:', user._id);
      return user;
    } catch (error) {
      console.error('UserService: Error getting user by email:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async getAllUsers() {
    console.log('UserService: Getting all users');
    try {
      const users = await User.find({}, '-password -refreshToken');
      console.log(`UserService: Found ${users.length} users`);
      return users;
    } catch (error) {
      console.error('UserService: Error getting all users:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    console.log('UserService: Updating user with ID:', userId);
    console.log('UserService: Update data:', JSON.stringify(updateData, null, 2));
    try {
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!user) {
        console.log('UserService: User not found for update with ID:', userId);
        throw new Error('User not found');
      }
      console.log('UserService: User updated successfully');
      return user;
    } catch (error) {
      console.error('UserService: Error updating user:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async deleteUser(userId) {
    console.log('UserService: Deleting user with ID:', userId);
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        console.log('UserService: User not found for deletion with ID:', userId);
        throw new Error('User not found');
      }
      console.log('UserService: User deleted successfully');
      return user;
    } catch (error) {
      console.error('UserService: Error deleting user:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }

  async authenticateUser(email, password) {
    console.log('UserService: Authenticating user with email:', email);
    try {
      console.log('UserService: Finding user by email');
      const user = await User.findOne({ email });
      if (!user) {
        console.log('UserService: User not found during authentication');
        throw new Error('User not found');
      }

      console.log('UserService: User found, comparing passwords');
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        console.log('UserService: Invalid password during authentication');
        throw new Error('Invalid credentials');
      }

      console.log('UserService: Authentication successful for user:', user._id);
      return user;
    } catch (error) {
      console.error('UserService: Error during authentication:', error.message);
      console.error('UserService: Error stack:', error.stack);
      throw error;
    }
  }
}

module.exports = new UserService();