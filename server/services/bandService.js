const Band = require("../models/Band");
const FileUploadUtil = require("../utils/fileUpload");
const ImageCleanupUtil = require("../utils/imageCleanup");

class BandService {
  async createBand(bandData) {
    try {
      const band = new Band(bandData);
      const savedBand = await band.save();
      return savedBand;
    } catch (error) {
      console.error("BandService: Error creating band:", error);
      throw error;
    }
  }

  async getAllBands() {
    try {
      const bands = await Band.find().sort({ order: 1, name: 1 });
      return bands;
    } catch (error) {
      console.error("BandService: Error fetching bands:", error);
      throw error;
    }
  }

  async getBandById(bandId) {
    try {
      const band = await Band.findById(bandId);
      if (!band) {
        throw new Error("Band not found");
      }
      return band;
    } catch (error) {
      console.error("BandService: Error fetching band:", error);
      throw error;
    }
  }

  async updateBand(bandId, updateData) {
    try {
      const existingBand = await Band.findById(bandId);
      if (!existingBand) {
        throw new Error("Band not found");
      }

      let imagePath = existingBand.image;

      if (updateData.hasOwnProperty("image")) {
        if (updateData.image && updateData.image.trim() !== "") {
          if (updateData.image.startsWith("/api/")) {
            imagePath = updateData.image.replace("/api/", "");
          } else {
            imagePath = updateData.image;
          }
        } else {
          imagePath = null;
        }
      }

      const updatedBand = await Band.findByIdAndUpdate(
        bandId,
        {
          ...updateData,
          image: imagePath,
        },
        { new: true, runValidators: true }
      );

      if (!updatedBand) {
        throw new Error("Band not found");
      }

      return updatedBand;
    } catch (error) {
      console.error("BandService: Error updating band:", error);
      throw error;
    }
  }

  async deleteBand(bandId) {
    try {
      const band = await Band.findByIdAndDelete(bandId);
      if (!band) {
        throw new Error("Band not found");
      }
      return band;
    } catch (error) {
      console.error("BandService: Error deleting band:", error);
      throw error;
    }
  }
}

module.exports = new BandService();
