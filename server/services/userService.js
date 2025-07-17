const User = require("../models/User");
const bcrypt = require("bcryptjs");

class UserService {
  async createUser(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      const hashedPassword = await bcrypt.hash(userData.password, 12);

      const user = new User({
        email: userData.email,
        password: hashedPassword,
        role: userData.role || "user",
      });

      const savedUser = await user.save();
      return savedUser;
    } catch (error) {
      throw error;
    }
  }

  async validateUser(email, password) {
    try {
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await User.findById(userId).select("-password");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await User.findOne({ email }).select("-password");
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });
      return users;
    } catch (error) {
      throw error;
    }
  }

  async updateUser(userId, updateData) {
    try {
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).select("-password");

      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await User.findByIdAndDelete(userId).select("-password");
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();
