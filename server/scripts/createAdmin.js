const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { connectDB } = require("../config/database");
const inquirer = require("inquirer");

const createAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();
    console.log("Connected to MongoDB");

    const questions = [
      {
        type: "input",
        name: "email",
        message: "Enter the email for the new admin user:",
        validate: function (value) {
          if (value.length && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return true;
          } else {
            return "Please enter a valid email address.";
          }
        },
      },
      {
        type: "password",
        name: "password",
        message: "Enter the password for the new admin user:",
        validate: function (value) {
          if (value.length >= 8) {
            return true;
          } else {
            return "Password must be at least 8 characters long.";
          }
        },
      },
    ];

    const answers = await inquirer.prompt(questions);
    const { email, password } = answers;

    // Check if user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      console.log(`User already exists with email: ${email}`);
      console.log(`User ID: ${existingUser._id}`);
      return;
    }

    console.log(`Creating admin user for: ${email}`);

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      email: email,
      password: hashedPassword,
      role: "admin",
    });

    // Save the new user to the database
    const savedUser = await newUser.save();

    console.log("Admin user created successfully!");
    console.log("Email:", savedUser.email);
    console.log("User ID:", savedUser._id);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    if (error.stack) {
      console.error("Error stack:", error.stack);
    }
  } finally {
    // Close the database connection
    console.log("Closing MongoDB connection...");
    await mongoose.connection.close();
    console.log("Connection closed.");
  }
};

createAdmin();
