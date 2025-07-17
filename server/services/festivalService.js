const Festival = require("../models/Festival");

class FestivalService {
  async createFestival(festivalData) {
    try {
      const festival = new Festival(festivalData);
      const savedFestival = await festival.save();
      return savedFestival;
    } catch (error) {
      throw error;
    }
  }

  async getAllFestivals() {
    try {
      const festivals = await Festival.find().sort({ year: -1 });
      return festivals;
    } catch (error) {
      throw error;
    }
  }

  async getActiveFestival() {
    try {
      const festival = await Festival.findOne({ isActive: true });
      if (!festival) {
        throw new Error("No active festival found");
      }
      return festival;
    } catch (error) {
      throw error;
    }
  }

  async getFestivalById(festivalId) {
    try {
      const festival = await Festival.findById(festivalId);
      if (!festival) {
        throw new Error("Festival not found");
      }
      return festival;
    } catch (error) {
      throw error;
    }
  }

  async updateFestival(festivalId, updateData) {
    try {
      const festival = await Festival.findByIdAndUpdate(
        festivalId,
        updateData,
        { new: true, runValidators: true }
      );
      if (!festival) {
        throw new Error("Festival not found");
      }
      return festival;
    } catch (error) {
      throw error;
    }
  }

  async deleteFestival(festivalId) {
    try {
      const festival = await Festival.findByIdAndDelete(festivalId);
      if (!festival) {
        throw new Error("Festival not found");
      }
      return festival;
    } catch (error) {
      throw error;
    }
  }

  async setActiveFestival(festivalId) {
    try {
      // First, set all festivals to inactive
      await Festival.updateMany({}, { isActive: false });

      // Then set the specified festival to active
      const festival = await Festival.findByIdAndUpdate(
        festivalId,
        { isActive: true },
        { new: true, runValidators: true }
      );

      if (!festival) {
        throw new Error("Festival not found");
      }
      return festival;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new FestivalService();
