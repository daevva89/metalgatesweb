// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bandRoutes = require("./routes/bandRoutes");
const newsRoutes = require("./routes/newsRoutes");
const archiveRoutes = require("./routes/archiveRoutes");
const festivalRoutes = require("./routes/festivalRoutes");
const contactRoutes = require("./routes/contactRoutes");
const siteAssetsRoutes = require("./routes/siteAssetsRoutes");
const { connectDB, ensureActiveFestivalExists } = require("./config/database");
const cors = require("cors");

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL variables in .env missing.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 4444;
// Pretty-print JSON responses
app.enable("json spaces");
// We want to be consistent with URL paths, so we enable strict routing
app.enable("strict routing");

app.use(cors({}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Request headers:", req.headers);
  next();
});

// Add body parsing with error handling
app.use((req, res, next) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    if (body) {
      console.log("Raw body received:", body);
      try {
        req.body = JSON.parse(body);
        console.log("JSON parsing successful");
      } catch (e) {
        console.log("JSON parsing failed:", e.message);
        req.body = {};
      }
    } else {
      req.body = {};
    }
    console.log("Body parsing middleware complete, calling next()");
    next();
  });
});

// Serve static files from uploads directory
console.log("Setting up static file serving for uploads");
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use("/api/auth", authRoutes);
// User Routes
app.use("/api/users", userRoutes);
// Band/Lineup Routes
console.log("Registering /api/lineup routes with bandRoutes");
app.use(
  "/api/lineup",
  (req, res, next) => {
    console.log(`Route middleware: ${req.method} /api/lineup${req.url}`);
    next();
  },
  bandRoutes
);
// News Routes
app.use("/api/news", newsRoutes);
// Archive Routes
app.use("/api/archives", archiveRoutes);
// Festival Routes
console.log("Registering /api/festivals routes with festivalRoutes");
app.use(
  "/api/festivals",
  (req, res, next) => {
    console.log(`Route middleware: ${req.method} /api/festivals${req.url}`);
    next();
  },
  festivalRoutes
);
// Contact Routes
console.log("Registering /api/contact routes with contactRoutes");
app.use(
  "/api/contact",
  (req, res, next) => {
    console.log(`Route middleware: ${req.method} /api/contact${req.url}`);
    next();
  },
  contactRoutes
);
// Site Assets Routes
console.log("Registering /api/site-assets routes with siteAssetsRoutes");
app.use(
  "/api/site-assets",
  (req, res, next) => {
    console.log(`Route middleware: ${req.method} /api/site-assets${req.url}`);
    next();
  },
  siteAssetsRoutes
);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Metal Gates Festival API" });
});

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

const startServer = async () => {
  try {
    await connectDB();
    await ensureActiveFestivalExists();
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
