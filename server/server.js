// Load environment variables
require("dotenv").config();
require("express-async-errors");

// Disable console logs in production
if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.info = () => {};
  console.warn = () => {};
  // Keep console.error for critical PM2 logs
}

const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const path = require("path");
const fs = require("fs");
const { generateOGTags, escapeHtml, isBotRequest } = require("./utils/ogTags");
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const bandRoutes = require("./routes/bandRoutes");
const newsRoutes = require("./routes/newsRoutes");
const archiveRoutes = require("./routes/archiveRoutes");
const festivalRoutes = require("./routes/festivalRoutes");
const contactRoutes = require("./routes/contactRoutes");
const siteAssetsRoutes = require("./routes/siteAssetsRoutes");
const infoPageRoutes = require("./routes/infoPageRoutes");
const visitRoutes = require("./routes/visitRoutes");
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

// Security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://www.googletagmanager.com",
        ],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: ["'self'", "https://www.google-analytics.com"],
        fontSrc: ["'self'", "https:", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'", "https://www.googletagmanager.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Serve uploaded files statically
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Standard body-parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log("Request headers:", req.headers);
  next();
});

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

// Visitor Routes
app.use("/api/visits", visitRoutes);

// Info Page Routes
app.use("/api/infopage", infoPageRoutes);

// Debug endpoint to test OG tag generation (only in development)
if (process.env.NODE_ENV !== "production") {
  app.get("/debug/og-tags", async (req, res) => {
    const url = req.query.url || "/";
    const baseUrl = `${req.protocol}://${req.get("host")}`;

    try {
      const ogTags = await generateOGTags(url, baseUrl);
      res.json({
        success: true,
        url: url,
        baseUrl: baseUrl,
        ogTags: ogTags,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
        stack: error.stack,
      });
    }
  });
}

// Serve frontend files in production
// This should be after all API routes and before the 404 handler
if (process.env.NODE_ENV === "production") {
  // Serve the static files from the React app
  const clientDistPath = path.join(__dirname, "../client/dist");
  console.log(`Serving static files from: ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  // Handles any requests that don't match the ones above by sending the React app with dynamic OG tags
  app.get("*", async (req, res) => {
    const indexPath = path.join(clientDistPath, "index.html");
    const userAgent = req.get("User-Agent") || "";

    // Check if this is a bot request that needs OG tags
    if (isBotRequest(userAgent)) {
      console.log(
        `Bot detected (${userAgent.substring(
          0,
          50
        )}...), serving with dynamic OG tags for: ${req.originalUrl}`
      );

      try {
        // Read the HTML file
        let html = fs.readFileSync(indexPath, "utf8");

        // Generate OG tags for this request
        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const ogTags = await generateOGTags(req.originalUrl, baseUrl);

        // Create the meta tags HTML
        const ogMetaTags = `
    <title>${escapeHtml(ogTags.title)}</title>
    <meta name="description" content="${escapeHtml(ogTags.description)}" />
    <meta property="og:title" content="${escapeHtml(ogTags.title)}" />
    <meta property="og:description" content="${escapeHtml(
      ogTags.description
    )}" />
    <meta property="og:image" content="${escapeHtml(ogTags.image)}" />
    <meta property="og:url" content="${escapeHtml(ogTags.url)}" />
    <meta property="og:type" content="${escapeHtml(ogTags.type)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(ogTags.title)}" />
    <meta name="twitter:description" content="${escapeHtml(
      ogTags.description
    )}" />
    <meta name="twitter:image" content="${escapeHtml(ogTags.image)}" />`;

        // Replace existing title and meta tags or inject before </head>
        // First, remove any existing title and basic meta description
        html = html.replace(/<title>.*?<\/title>/i, "");
        html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, "");

        // Inject our tags before the closing head tag
        html = html.replace("</head>", `${ogMetaTags}\n  </head>`);

        console.log(`OG tags injected for ${req.originalUrl}: ${ogTags.title}`);
        res.send(html);
      } catch (error) {
        console.error("Error serving HTML with OG tags:", error);
        // Fallback to serving static file if there's an error
        res.sendFile(indexPath);
      }
    } else {
      // Regular user request - serve static file directly for better performance
      console.log(`Regular user request for: ${req.originalUrl}`);
      res.sendFile(indexPath);
    }
  });
}

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
// This is disabled in development to allow for the Vite dev server to handle frontend requests.
if (process.env.NODE_ENV !== "production") {
  // Default route for API testing
  app.get("/", (req, res) => {
    res.json({ message: "Metal Gates Festival API" });
  });
}

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || "There was an error serving your request.",
  });
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
