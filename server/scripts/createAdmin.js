const mongoose = require("mongoose");
const User = require("../models/User");
const { hashPassword } = require("../utils/password");
require("dotenv").config();

const createAdminUser = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB");

    const adminEmail = "mihai.ilie89@gmail.com";
    const adminPassword = "Alskdj123!ml";

    // Check if admin user already exists
    // const existingUser = await User.findOne({ email: adminEmail });
    // if (existingUser) {
    //   console.log('Admin user already exists with email:', adminEmail);
    //   console.log('User ID:', existingUser._id);
    //   console.log('User role:', existingUser.role);
    //   process.exit(0);
    // }

    console.log("Creating admin user...");
    const hashedPassword = await hashPassword(adminPassword);

    const adminUser = new User({
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    const savedUser = await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email:", savedUser.email);
    console.log("Role:", savedUser.role);
    console.log("User ID:", savedUser._id);

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin user:", error.message);
    console.error("Error stack:", error.stack);
    process.exit(1);
  }
};

createAdminUser();
