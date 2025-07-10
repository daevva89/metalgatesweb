const Band = require("../models/Band");
const FileUploadUtil = require("../utils/fileUpload");
const ImageCleanupUtil = require("../utils/imageCleanup");

class BandService {
  async createBand(bandData) {
    try {
      console.log("BandService: Creating new band");

      // The image path is now coming from multer as a URL path.
      // We need to strip the /api/ prefix to store a relative path.
      const imagePath = bandData.image
        ? bandData.image.replace("/api/", "")
        : null;

      const band = new Band({
        name: bandData.name,
        country: bandData.country,
        genre: bandData.genre || "",
        image: imagePath, // Save the relative path
        biography: bandData.biography,
        spotifyEmbed: bandData.spotifyEmbed || "",
        socialLinks: bandData.socialLinks || {},
      });

      const savedBand = await band.save();
      console.log("BandService: Band created successfully");

      // Convert image path to URL for response
      const response = savedBand.toObject();
      if (response.image) {
        response.image = FileUploadUtil.getImageUrl(response.image);
      }

      return response;
    } catch (error) {
      console.error("BandService: Error creating band:", error);
      throw error;
    }
  }

  async getAllBands() {
    try {
      console.log("BandService: Fetching all bands");
      const bands = await Band.find().sort({ createdAt: 1 });
      console.log(`BandService: Found ${bands.length} bands`);

      // Convert image paths to URLs
      const bandsWithUrls = bands.map((band) => {
        const bandObj = band.toObject();
        if (bandObj.image) {
          bandObj.image = FileUploadUtil.getImageUrl(bandObj.image);
        }
        return bandObj;
      });

      return bandsWithUrls;
    } catch (error) {
      console.error("BandService: Error fetching bands:", error);
      throw error;
    }
  }

  async getBandById(bandId) {
    try {
      console.log("BandService: Fetching band by ID:", bandId);
      const band = await Band.findById(bandId);

      if (!band) {
        throw new Error("Band not found");
      }

      console.log("BandService: Band found");

      // Convert image path to URL
      const response = band.toObject();
      if (response.image) {
        response.image = FileUploadUtil.getImageUrl(response.image);
      }

      return response;
    } catch (error) {
      console.error("BandService: Error fetching band:", error);
      throw error;
    }
  }

  async updateBand(bandId, updateData) {
    try {
      console.log("BandService: Updating band:", bandId);

      const existingBand = await Band.findById(bandId);
      if (!existingBand) {
        throw new Error("Band not found");
      }

      let imagePath = existingBand.image;

      // Handle image update if a new image path is provided in updateData
      if (updateData.image !== undefined) {
        // A new image is being uploaded or the existing one is removed.
        // Clean up the old image first.
        if (existingBand.image) {
          await ImageCleanupUtil.cleanupBandImages(existingBand);
        }

        if (updateData.image) {
          // New image provided. Store its relative path.
          imagePath = updateData.image.replace("/api/", "");
          console.log("BandService: Band image updated successfully");
        } else {
          // Image is being removed.
          imagePath = null;
          console.log("BandService: Band image removed");
        }
      }

      const {
        name,
        country,
        genre,
        biography,
        spotifyEmbed,
        ...socialLinksData
      } = updateData;

      const updatedBandData = {
        name,
        country,
        genre: genre || "",
        image: imagePath,
        biography,
        spotifyEmbed: spotifyEmbed || "",
        socialLinks: {
          facebook: socialLinksData.facebook,
          instagram: socialLinksData.instagram,
          youtube: socialLinksData.youtube,
          tiktok: socialLinksData.tiktok,
          bandcamp: socialLinksData.bandcamp,
          website: socialLinksData.website,
        },
      };

      const updatedBand = await Band.findByIdAndUpdate(
        bandId,
        updatedBandData,
        { new: true }
      );

      console.log("BandService: Band updated successfully");

      // Convert image path to URL for response
      const response = updatedBand.toObject();
      if (response.image) {
        response.image = FileUploadUtil.getImageUrl(response.image);
      }

      return response;
    } catch (error) {
      console.error("BandService: Error updating band:", error);
      throw error;
    }
  }

  async deleteBand(bandId) {
    try {
      console.log("BandService: Deleting band:", bandId);

      const band = await Band.findById(bandId);
      if (!band) {
        throw new Error("Band not found");
      }

      // Clean up associated images
      await ImageCleanupUtil.cleanupBandImages(band);

      await Band.findByIdAndDelete(bandId);
      console.log("BandService: Band deleted successfully");

      return band;
    } catch (error) {
      console.error("BandService: Error deleting band:", error);
      throw error;
    }
  }
}

module.exports = new BandService();
