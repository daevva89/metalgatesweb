const express = require("express");
const router = express.Router();
const siteAssetsService = require("../services/siteAssetsService");
const auth = require("./middleware/auth");

// Get site assets (public endpoint)
router.get("/", async (req, res) => {
  console.log("SiteAssetsRoutes: GET / - Getting site assets");
  try {
    const assets = await siteAssetsService.getSiteAssets();
    console.log("SiteAssetsRoutes: Site assets retrieved successfully");
    res.json({
      success: true,
      data: {
        assets: {
          logo: assets.logo,
          heroImage: assets.heroImage,
          mobileHeroImage: assets.mobileHeroImage,
          countdownDate: assets.countdownDate,
          bannerText: assets.bannerText,
          contactEmail: assets.contactEmail,
          phoneNumber: assets.phoneNumber,
          lineupTitle: assets.lineupTitle,
          lineupDescription: assets.lineupDescription,
        },
      },
      message: "Site assets retrieved successfully",
    });
  } catch (error) {
    console.error("SiteAssetsRoutes: Error getting site assets:", error);
    res.status(500).json({
      success: false,
      error: "Failed to retrieve site assets",
    });
  }
});

// Update site assets (admin only)
router.put("/", auth, async (req, res) => {
  console.log("SiteAssetsRoutes: PUT / - Updating site assets");
  console.log("SiteAssetsRoutes: Request body keys:", Object.keys(req.body));
  console.log("SiteAssetsRoutes: Request body structure:", {
    hasLogo: "logo" in req.body,
    hasHeroImage: "heroImage" in req.body,
    logoType: typeof req.body.logo,
    heroImageType: typeof req.body.heroImage,
    logoLength: req.body.logo ? req.body.logo.length : 0,
    heroImageLength: req.body.heroImage ? req.body.heroImage.length : 0,
  });

  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      console.log("SiteAssetsRoutes: Access denied - user is not admin");
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin role required.",
      });
    }

    const {
      logo,
      heroImage,
      mobileHeroImage,
      countdownDate,
      bannerText,
      contactEmail,
      phoneNumber,
      lineupTitle,
      lineupDescription,
    } = req.body;
    console.log("SiteAssetsRoutes: Full request body:", req.body);
    console.log("SiteAssetsRoutes: Update data received:", {
      hasLogo: !!logo,
      hasHeroImage: !!heroImage,
      hasMobileHeroImage: !!mobileHeroImage,
      hasCountdownDate: !!countdownDate,
      hasBannerText: bannerText !== undefined,
      hasContactEmail: contactEmail !== undefined,
      hasPhoneNumber: phoneNumber !== undefined,
      hasLineupTitle: lineupTitle !== undefined,
      hasLineupDescription: lineupDescription !== undefined,
      logoLength: logo ? logo.length : 0,
      heroImageLength: heroImage ? heroImage.length : 0,
      mobileHeroImageLength: mobileHeroImage ? mobileHeroImage.length : 0,
      countdownDateValue: countdownDate,
      bannerTextValue: bannerText,
      contactEmailValue: contactEmail,
      phoneNumberValue: phoneNumber,
      lineupTitleValue: lineupTitle,
      lineupDescriptionValue: lineupDescription,
    });

    const updateData = {};
    if (logo !== undefined) updateData.logo = logo;
    if (heroImage !== undefined) updateData.heroImage = heroImage;
    if (mobileHeroImage !== undefined)
      updateData.mobileHeroImage = mobileHeroImage;
    if (countdownDate !== undefined) updateData.countdownDate = countdownDate;
    if (bannerText !== undefined) updateData.bannerText = bannerText;
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (lineupTitle !== undefined) updateData.lineupTitle = lineupTitle;
    if (lineupDescription !== undefined)
      updateData.lineupDescription = lineupDescription;

    console.log(
      "SiteAssetsRoutes: Calling siteAssetsService.updateSiteAssets with:",
      {
        hasLogo: "logo" in updateData,
        hasHeroImage: "heroImage" in updateData,
        hasMobileHeroImage: "mobileHeroImage" in updateData,
        hasCountdownDate: "countdownDate" in updateData,
        hasBannerText: "bannerText" in updateData,
        hasContactEmail: "contactEmail" in updateData,
        hasPhoneNumber: "phoneNumber" in updateData,
        hasLineupTitle: "lineupTitle" in updateData,
        hasLineupDescription: "lineupDescription" in updateData,
      }
    );

    const updatedAssets = await siteAssetsService.updateSiteAssets(updateData);
    console.log("SiteAssetsRoutes: Site assets updated successfully");
    console.log(
      "SiteAssetsRoutes: updatedAssets returned from service:",
      updatedAssets
    );

    const responsePayload = {
      success: true,
      data: {
        assets: {
          logo: updatedAssets.logo,
          heroImage: updatedAssets.heroImage,
          mobileHeroImage: updatedAssets.mobileHeroImage,
          countdownDate: updatedAssets.countdownDate,
          bannerText: updatedAssets.bannerText,
          contactEmail: updatedAssets.contactEmail,
          phoneNumber: updatedAssets.phoneNumber,
          lineupTitle: updatedAssets.lineupTitle,
          lineupDescription: updatedAssets.lineupDescription,
        },
      },
      message: "Site assets updated successfully",
    };

    console.log(
      "SiteAssetsRoutes: Response payload being sent:",
      responsePayload
    );
    res.json(responsePayload);
  } catch (error) {
    console.error("SiteAssetsRoutes: Error updating site assets:", error);
    console.error("SiteAssetsRoutes: Error stack:", error.stack);
    res.status(500).json({
      success: false,
      error: "Failed to update site assets",
    });
  }
});

// Update logo only (admin only)
router.put("/logo", auth, async (req, res) => {
  console.log("SiteAssetsRoutes: PUT /logo - Updating logo");
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      console.log("SiteAssetsRoutes: Access denied - user is not admin");
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin role required.",
      });
    }

    const { logo } = req.body;
    console.log("SiteAssetsRoutes: Logo data received:", !!logo);

    const updatedAssets = await siteAssetsService.updateLogo(logo);
    console.log("SiteAssetsRoutes: Logo updated successfully");

    res.json({
      success: true,
      data: {
        assets: {
          logo: updatedAssets.logo,
          heroImage: updatedAssets.heroImage,
          mobileHeroImage: updatedAssets.mobileHeroImage,
          countdownDate: updatedAssets.countdownDate,
          bannerText: updatedAssets.bannerText,
          contactEmail: updatedAssets.contactEmail,
          phoneNumber: updatedAssets.phoneNumber,
          lineupTitle: updatedAssets.lineupTitle,
          lineupDescription: updatedAssets.lineupDescription,
        },
      },
      message: "Logo updated successfully",
    });
  } catch (error) {
    console.error("SiteAssetsRoutes: Error updating logo:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update logo",
    });
  }
});

// Update hero image only (admin only)
router.put("/hero", auth, async (req, res) => {
  console.log("SiteAssetsRoutes: PUT /hero - Updating hero image");
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      console.log("SiteAssetsRoutes: Access denied - user is not admin");
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin role required.",
      });
    }

    const { heroImage } = req.body;
    console.log("SiteAssetsRoutes: Hero image data received:", !!heroImage);

    const updatedAssets = await siteAssetsService.updateHeroImage(heroImage);
    console.log("SiteAssetsRoutes: Hero image updated successfully");

    res.json({
      success: true,
      data: {
        assets: {
          logo: updatedAssets.logo,
          heroImage: updatedAssets.heroImage,
          mobileHeroImage: updatedAssets.mobileHeroImage,
          countdownDate: updatedAssets.countdownDate,
          bannerText: updatedAssets.bannerText,
          contactEmail: updatedAssets.contactEmail,
          phoneNumber: updatedAssets.phoneNumber,
          lineupTitle: updatedAssets.lineupTitle,
          lineupDescription: updatedAssets.lineupDescription,
        },
      },
      message: "Hero image updated successfully",
    });
  } catch (error) {
    console.error("SiteAssetsRoutes: Error updating hero image:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update hero image",
    });
  }
});

// Remove logo (admin only)
router.delete("/logo", auth, async (req, res) => {
  console.log("SiteAssetsRoutes: DELETE /logo - Removing logo");
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      console.log("SiteAssetsRoutes: Access denied - user is not admin");
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin role required.",
      });
    }

    const updatedAssets = await siteAssetsService.removeLogo();
    console.log("SiteAssetsRoutes: Logo removed successfully");

    res.json({
      success: true,
      data: {
        assets: {
          logo: updatedAssets.logo,
          heroImage: updatedAssets.heroImage,
          mobileHeroImage: updatedAssets.mobileHeroImage,
          countdownDate: updatedAssets.countdownDate,
          bannerText: updatedAssets.bannerText,
          contactEmail: updatedAssets.contactEmail,
          phoneNumber: updatedAssets.phoneNumber,
          lineupTitle: updatedAssets.lineupTitle,
          lineupDescription: updatedAssets.lineupDescription,
        },
      },
      message: "Logo removed successfully",
    });
  } catch (error) {
    console.error("SiteAssetsRoutes: Error removing logo:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove logo",
    });
  }
});

// Remove hero image (admin only)
router.delete("/hero", auth, async (req, res) => {
  console.log("SiteAssetsRoutes: DELETE /hero - Removing hero image");
  try {
    // Check if user is admin
    if (req.user.role !== "admin") {
      console.log("SiteAssetsRoutes: Access denied - user is not admin");
      return res.status(403).json({
        success: false,
        error: "Access denied. Admin role required.",
      });
    }

    const updatedAssets = await siteAssetsService.removeHeroImage();
    console.log("SiteAssetsRoutes: Hero image removed successfully");

    res.json({
      success: true,
      data: {
        assets: {
          logo: updatedAssets.logo,
          heroImage: updatedAssets.heroImage,
          mobileHeroImage: updatedAssets.mobileHeroImage,
          countdownDate: updatedAssets.countdownDate,
          bannerText: updatedAssets.bannerText,
          contactEmail: updatedAssets.contactEmail,
          phoneNumber: updatedAssets.phoneNumber,
          lineupTitle: updatedAssets.lineupTitle,
          lineupDescription: updatedAssets.lineupDescription,
        },
      },
      message: "Hero image removed successfully",
    });
  } catch (error) {
    console.error("SiteAssetsRoutes: Error removing hero image:", error);
    res.status(500).json({
      success: false,
      error: "Failed to remove hero image",
    });
  }
});

module.exports = router;
