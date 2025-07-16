const siteAssetsService = require("../services/siteAssetsService");
const newsService = require("../services/newsService");

/**
 * Check if the request is from a social media crawler or search engine bot
 * @param {string} userAgent - The User-Agent header from the request
 * @returns {boolean} True if it's a bot that needs OG tags
 */
function isBotRequest(userAgent) {
  if (!userAgent) return false;

  const botPatterns = [
    "facebookexternalhit", // Facebook
    "Twitterbot", // Twitter
    "WhatsApp", // WhatsApp
    "TelegramBot", // Telegram
    "Slackbot", // Slack
    "LinkedInBot", // LinkedIn
    "DiscordBot", // Discord
    "Googlebot", // Google
    "bingbot", // Bing
    "Applebot", // Apple
    "Yahoo! Slurp", // Yahoo
    "DuckDuckBot", // DuckDuckGo
    "YandexBot", // Yandex
    "crawler", // Generic crawlers
    "spider", // Generic spiders
    "scraper", // Generic scrapers
  ];

  const userAgentLower = userAgent.toLowerCase();
  return botPatterns.some((pattern) =>
    userAgentLower.includes(pattern.toLowerCase())
  );
}

/**
 * Generate dynamic Open Graph tags based on the request URL
 * @param {string} url - The request URL path
 * @param {string} baseUrl - The base URL (protocol + host)
 * @returns {Promise<object>} Object containing OG tag values
 */
async function generateOGTags(url, baseUrl) {
  try {
    // Fetch site assets for default values
    const assets = await siteAssetsService.getSiteAssets();

    // Determine default image URL (ensure it's absolute)
    let defaultImage = assets.heroImage || assets.logo || "";
    if (defaultImage && !defaultImage.startsWith("http")) {
      defaultImage = defaultImage.startsWith("/")
        ? `${baseUrl}${defaultImage}`
        : `${baseUrl}/${defaultImage}`;
    }

    // Default tags
    let ogTags = {
      title: assets.seoTitles?.home || "Metal Gates Festival",
      description:
        assets.seoDescriptions?.home ||
        "Official website for Metal Gates Festival. Get the latest news, lineup, tickets, and info.",
      image: defaultImage,
      url: `${baseUrl}${url}`,
      type: "website",
    };

    // Page-specific overrides
    if (url.match(/^\/news\/[a-f0-9]{24}$/)) {
      // Individual news article (MongoDB ObjectId pattern)
      const articleId = url.split("/news/")[1];
      try {
        const article = await newsService.getArticleById(articleId);
        if (article) {
          ogTags.title = `${article.title} - Metal Gates Festival`;
          ogTags.description =
            article.excerpt || "Detailed article about Metal Gates Festival.";

          // Ensure article image is absolute URL
          if (article.image) {
            ogTags.image = article.image.startsWith("http")
              ? article.image
              : `${baseUrl}${article.image}`;
          }
          ogTags.type = "article";
        }
      } catch (error) {
        console.log("OGTags: Could not fetch article for ID:", articleId);
        // Keep default tags if article not found
      }
    } else if (url.includes("/news")) {
      ogTags.title = assets.seoTitles?.news || "News - Metal Gates Festival";
      ogTags.description =
        assets.seoDescriptions?.news ||
        "Read the latest news and updates about Metal Gates Festival.";
    } else if (url.includes("/lineup")) {
      ogTags.title =
        assets.seoTitles?.lineup || "Lineup - Metal Gates Festival";
      ogTags.description =
        assets.seoDescriptions?.lineup ||
        "See the full lineup for Metal Gates Festival.";
    } else if (url.includes("/info")) {
      ogTags.title = assets.seoTitles?.info || "Info - Metal Gates Festival";
      ogTags.description =
        assets.seoDescriptions?.info ||
        "Find all the information you need about Metal Gates Festival.";
    } else if (url.includes("/archive")) {
      ogTags.title =
        assets.seoTitles?.archive || "Archive - Metal Gates Festival";
      ogTags.description =
        assets.seoDescriptions?.archive ||
        "Explore the archive of past Metal Gates Festival events.";
    } else if (url.includes("/contact")) {
      ogTags.title =
        assets.seoTitles?.contact || "Contact - Metal Gates Festival";
      ogTags.description =
        assets.seoDescriptions?.contact ||
        "Contact Metal Gates Festival organizers.";
    } else if (url.includes("/login")) {
      ogTags.title = assets.seoTitles?.login || "Login - Metal Gates Festival";
      ogTags.description =
        assets.seoDescriptions?.login ||
        "Login to the Metal Gates Festival admin panel.";
    } else if (url === "/404" || !url.match(/^\/[^?]*$/)) {
      ogTags.title =
        assets.seoTitles?.notFound ||
        "404 - Page Not Found - Metal Gates Festival";
      ogTags.description =
        assets.seoDescriptions?.notFound ||
        "Page not found on Metal Gates Festival website.";
    }

    return ogTags;
  } catch (error) {
    console.error("OGTags: Error generating OG tags:", error);

    // Return fallback tags if there's an error
    return {
      title: "Metal Gates Festival",
      description: "Official website for Metal Gates Festival",
      image: "",
      url: `${baseUrl}${url}`,
      type: "website",
    };
  }
}

/**
 * Escape HTML characters in strings to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} Escaped string
 */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = { generateOGTags, escapeHtml, isBotRequest };
