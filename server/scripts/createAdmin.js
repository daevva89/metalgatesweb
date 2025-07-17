const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { connectDB } = require("../config/database");
const inquirer = require("inquirer");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);

    const email = "admin@metalgatesfestival.com";
    const password = "MGF2024Admin!";

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin user
    const adminUser = new User({
      email,
      password: hashedPassword,
      role: "admin",
    });

    const savedUser = await adminUser.save();

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();
