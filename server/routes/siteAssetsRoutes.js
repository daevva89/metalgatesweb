const express = require("express");
const router = express.Router();
const siteAssetsService = require("../services/siteAssetsService");
const auth = require("./middleware/auth");
const upload = require("../utils/upload");

// Get site assets (public endpoint)
router.get("/", async (req, res) => {
  try {
    const assets = await siteAssetsService.getSiteAssets();
    res.json({
      success: true,
      data: {
        assets: {
          logo: assets.logo,
          heroImage: assets.heroImage,
          mobileHeroImage: assets.mobileHeroImage,
          countdownDate: assets.countdownDate,
          bannerText: assets.bannerText,
          contactEmails: assets.contactEmails,
          lineupTitle: assets.lineupTitle,
          lineupDescription: assets.lineupDescription,
          gtmId: assets.gtmId,
          facebook: assets.facebook,
          instagram: assets.instagram,
          youtube: assets.youtube,
          seoTitles: assets.seoTitles,
          seoDescriptions: assets.seoDescriptions,
          copyright: assets.copyright,
        },
      },
      message: "Site assets retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve site assets",
    });
  }
});

// Update site assets (admin only)
router.put(
  "/",
  auth,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "heroImage", maxCount: 1 },
    { name: "mobileHeroImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (req.user.role !== "admin") {
        return res.status(403).json({
          success: false,
          error: "Access denied. Admin role required.",
        });
      }

      const updateData = { ...req.body };

      if (req.files) {
        if (req.files.logo) {
          updateData.logo = `/api/uploads/${req.files.logo[0].filename}`;
        }
        if (req.files.heroImage) {
          updateData.heroImage = `/api/uploads/${req.files.heroImage[0].filename}`;
        }
        if (req.files.mobileHeroImage) {
          updateData.mobileHeroImage = `/api/uploads/${req.files.mobileHeroImage[0].filename}`;
        }
      }

      const updatedAssets = await siteAssetsService.updateSiteAssets(
        updateData
      );

      res.json({
        success: true,
        data: {
          assets: {
            logo: updatedAssets.logo,
            heroImage: updatedAssets.heroImage,
            mobileHeroImage: updatedAssets.mobileHeroImage,
            countdownDate: updatedAssets.countdownDate,
            bannerText: updatedAssets.bannerText,
            contactEmails: updatedAssets.contactEmails,
            lineupTitle: updatedAssets.lineupTitle,
            lineupDescription: updatedAssets.lineupDescription,
            gtmId: updatedAssets.gtmId,
            facebook: updatedAssets.facebook,
            instagram: updatedAssets.instagram,
            youtube: updatedAssets.youtube,
            seoTitles: updatedAssets.seoTitles,
            seoDescriptions: updatedAssets.seoDescriptions,
            copyright: updatedAssets.copyright,
          },
        },
        message: "Site assets updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Failed to update site assets",
      });
    }
  }
);

// Update logo only (admin only)
router.put("/logo", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin role required.",
      });
    }

    const { logo } = req.body;

    const updatedAssets = await siteAssetsService.updateLogo(logo);

    res.json({
      success: true,
      data: {
        assets: {
          logo: updatedAssets.logo,
          heroImage: updatedAssets.heroImage,
          mobileHeroImage: updatedAssets.mobileHeroImage,
          countdownDate: updatedAssets.countdownDate,
          bannerText: updatedAssets.bannerText,
          contactEmails: updatedAssets.contactEmails,
          lineupTitle: updatedAssets.lineupTitle,
          lineupDescription: updatedAssets.lineupDescription,
          gtmId: updatedAssets.gtmId,
          facebook: updatedAssets.facebook,
          instagram: updatedAssets.instagram,
          youtube: updatedAssets.youtube,
          seoTitles: updatedAssets.seoTitles,
          seoDescriptions: updatedAssets.seoDescriptions,
          copyright: updatedAssets.copyright,
        },
      },
      message: "Logo updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update logo",
    });
  }
});

// Update hero image only (admin only)
router.put("/hero", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin role required.",
      });
    }

    const { heroImage } = req.body;

    const updatedAssets = await siteAssetsService.updateHeroImage(heroImage);

    res.json({
      success: true,
      data: {
        assets: {
          logo: updatedAssets.logo,
          heroImage: updatedAssets.heroImage,
          mobileHeroImage: updatedAssets.mobileHeroImage,
          countdownDate: updatedAssets.countdownDate,
          bannerText: updatedAssets.bannerText,
          contactEmails: updatedAssets.contactEmails,
          lineupTitle: updatedAssets.lineupTitle,
          lineupDescription: updatedAssets.lineupDescription,
          gtmId: updatedAssets.gtmId,
          facebook: updatedAssets.facebook,
          instagram: updatedAssets.instagram,
          youtube: updatedAssets.youtube,
          seoTitles: updatedAssets.seoTitles,
          seoDescriptions: updatedAssets.seoDescriptions,
          copyright: updatedAssets.copyright,
        },
      },
      message: "Hero image updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update hero image",
    });
  }
});

// Remove logo (admin only)
router.delete("/logo", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin role required.",
      });
    }

    const updatedAssets = await siteAssetsService.removeLogo();

    res.json({
      success: true,
      data: {
        assets: {
          logo: updatedAssets.logo,
          heroImage: updatedAssets.heroImage,
          mobileHeroImage: updatedAssets.mobileHeroImage,
          countdownDate: updatedAssets.countdownDate,
          bannerText: updatedAssets.bannerText,
          contactEmails: updatedAssets.contactEmails,
          lineupTitle: updatedAssets.lineupTitle,
          lineupDescription: updatedAssets.lineupDescription,
          gtmId: updatedAssets.gtmId,
          facebook: updatedAssets.facebook,
          instagram: updatedAssets.instagram,
          youtube: updatedAssets.youtube,
          seoTitles: updatedAssets.seoTitles,
          seoDescriptions: updatedAssets.seoDescriptions,
          copyright: updatedAssets.copyright,
        },
      },
      message: "Logo removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to remove logo",
    });
  }
});

// Remove hero image (admin only)
router.delete("/hero", auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin role required.",
      });
    }

    const updatedAssets = await siteAssetsService.removeHeroImage();

    res.json({
      success: true,
      data: {
        assets: {
          logo: updatedAssets.logo,
          heroImage: updatedAssets.heroImage,
          mobileHeroImage: updatedAssets.mobileHeroImage,
          countdownDate: updatedAssets.countdownDate,
          bannerText: updatedAssets.bannerText,
          contactEmails: updatedAssets.contactEmails,
          lineupTitle: updatedAssets.lineupTitle,
          lineupDescription: updatedAssets.lineupDescription,
          gtmId: updatedAssets.gtmId,
          facebook: updatedAssets.facebook,
          instagram: updatedAssets.instagram,
          youtube: updatedAssets.youtube,
          seoTitles: updatedAssets.seoTitles,
          seoDescriptions: updatedAssets.seoDescriptions,
          copyright: updatedAssets.copyright,
        },
      },
      message: "Hero image removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to remove hero image",
    });
  }
});

module.exports = router;
