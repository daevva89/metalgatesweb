require("dotenv").config();
require("express-async-errors");

// Production domain configuration to prevent localhost redirects
const PRODUCTION_DOMAIN = "metalgatesfestival.com";
// Use a function to ensure NODE_ENV is evaluated after dotenv loads
const isProduction = () => process.env.NODE_ENV === "production";

// Disable console logs in production
if (isProduction()) {
  console.info = () => {};
  console.warn = () => {};
  // Keep console.error for critical PM2 logs
}

const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
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

// Force HTTPS in production
if (isProduction()) {
  app.use((req, res, next) => {
    // Special handling for bot requests that come through nginx proxy without proper headers
    const userAgent = req.get("User-Agent") || "";
    const isBotRequest = require("./utils/ogTags").isBotRequest(userAgent);

    // If it's a bot request and we detect it's coming from localhost (nginx proxy)
    if (
      isBotRequest &&
      req.get("host") &&
      req.get("host").includes("localhost")
    ) {
      // Don't redirect, treat as if it's properly proxied from production domain
      return next();
    }

    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });

  // Trust proxy headers for production deployment
  app.set("trust proxy", true);
}

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
          "'unsafe-inline'", // Allow GTM to inject dynamic Meta pixel code
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
          "https://connect.facebook.net", // Meta pixel
        ],
        styleSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          // Secure CSP - no unsafe-inline allowed
        ],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        connectSrc: [
          "'self'",
          "https://www.google-analytics.com",
          "https://www.googletagmanager.com",
          "https://www.facebook.com", // Meta pixel tracking
          "https://connect.facebook.net", // Meta pixel requests
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'self'", "https://open.spotify.com"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        upgradeInsecureRequests: [],
      },
      // Ensure CSP is enforced, not just reported
      reportOnly: false,
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);

// Additional explicit security headers as backup
app.use((req, res, next) => {
  // Strict Transport Security
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload"
  );

  // X-Frame-Options
  res.setHeader("X-Frame-Options", "SAMEORIGIN");

  // X-Content-Type-Options
  res.setHeader("X-Content-Type-Options", "nosniff");

  // Referrer Policy
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  // Permissions Policy
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  // X-XSS-Protection (legacy but still useful)
  res.setHeader("X-XSS-Protection", "1; mode=block");

  next();
});

// Rate limiting to prevent abuse (more lenient for security scanners)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction() ? 5000 : 10000, // Increased for scanners
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for security scanners
  skip: (req) => {
    const userAgent = req.get("User-Agent") || "";
    return (
      userAgent.toLowerCase().includes("sucuri") ||
      userAgent.toLowerCase().includes("scanner") ||
      userAgent.toLowerCase().includes("bot")
    );
  },
});

app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction() ? 10 : 100, // More lenient in development
  message: {
    error: "Too many authentication attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
app.use(cors());

// Serve uploaded files statically
app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

// Standard body-parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Authentication Routes (with stricter rate limiting)
app.use("/api/auth", authLimiter, authRoutes);
// User Routes
app.use("/api/users", userRoutes);
// Band/Lineup Routes
app.use("/api/lineup", bandRoutes);
// News Routes
app.use("/api/news", newsRoutes);
// Archive Routes
app.use("/api/archives", archiveRoutes);
// Festival Routes
app.use("/api/festivals", festivalRoutes);
// Contact Routes
app.use("/api/contact", contactRoutes);
// Site Assets Routes
app.use("/api/site-assets", siteAssetsRoutes);

// Visitor Routes
app.use("/api/visits", visitRoutes);

// Info Page Routes
app.use("/api/infopage", infoPageRoutes);

// Debug endpoint to test OG tag generation (only in development)
if (!isProduction()) {
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
if (isProduction()) {
  const clientDistPath = path.join(__dirname, "../client/dist");

  // Serve static assets only (not HTML files) - this prevents conflicts with dynamic routing
  app.use("/assets", express.static(path.join(clientDistPath, "assets")));
  app.use(
    "/favicon.ico",
    express.static(path.join(clientDistPath, "favicon.ico"))
  );

  // Handles any requests that don't match the ones above by sending the React app with dynamic OG tags
  app.get("*", async (req, res) => {
    const indexPath = path.join(clientDistPath, "index.html");
    const userAgent = req.get("User-Agent") || "";

    // Check if this is a bot request that needs OG tags
    if (isBotRequest(userAgent)) {
      try {
        // Read the HTML file
        let html = fs.readFileSync(indexPath, "utf8");

        // Generate OG tags for this request
        // Fix baseUrl to prevent localhost:4444 redirects (Google Ads violation)
        const host = req.get("host");

        // Enhanced logic for baseUrl generation
        let baseUrl;
        if (isProduction()) {
          // Always use production domain for bots in production
          baseUrl = `https://${PRODUCTION_DOMAIN}`;
        } else if (host && host.includes("localhost")) {
          // Development or nginx proxy without proper headers
          baseUrl = "https://metalgatesfestival.com";
        } else {
          // Fallback to request headers
          baseUrl = `${req.protocol}://${host}`;
        }

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

        res.send(html);
      } catch (error) {
        console.error("Error serving HTML with OG tags:", error);
        // Fallback to serving static file if there's an error
        res.sendFile(indexPath);
      }
    } else {
      // Regular user request - serve static file directly for better performance
      res.sendFile(indexPath);
    }
  });
}

// Basic Routes (moved after production handling to avoid conflicts)
app.use(basicRoutes);

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
// This is disabled in development to allow for the Vite dev server to handle frontend requests.
if (!isProduction()) {
  // Default route for API testing
  app.get("/", (req, res) => {
    res.json({ message: "Metal Gates Festival API" });
  });
}

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
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
    app.listen(port, () => {});
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
