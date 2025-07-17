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
      throw error;
    }
  }

  async getAllBands() {
    try {
      const bands = await Band.find().sort({ createdAt: -1 });
      return bands;
    } catch (error) {
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
      throw error;
    }
  }

  async updateBand(bandId, updateData) {
    try {
      let imagePath = updateData.image;
      if (updateData.image && !updateData.image.startsWith("/")) {
        imagePath = updateData.image;
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
      throw error;
    }
  }
}

module.exports = new BandService();
