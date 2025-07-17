const mongoose = require("mongoose");
const Festival = require("../models/Festival");
require("dotenv").config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);


    // Error handling after initial connection
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.info("MongoDB reconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        process.exit(0);
      } catch (err) {
        console.error("Error during MongoDB shutdown:", err);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const ensureActiveFestivalExists = async () => {
  try {
    const activeFestival = await Festival.findOne({ isActive: true });
    if (!activeFestival) {
      const defaultFestival = new Festival({
        name: "Metal Gates Festival 2025",
        dates: "September 26-27, 2025",
        description: "This is a test description",
        location: "Quantic, Bucharest",
        ticketUrl:
          "https://www.iabilet.ro/bilete-metal-gates-festival-2024-89803",
        isActive: true,
      });
      await defaultFestival.save();
    }
  } catch (error) {
    console.error("Error ensuring active festival exists:", error);
  }
};

module.exports = {
  connectDB,
  ensureActiveFestivalExists,
};
