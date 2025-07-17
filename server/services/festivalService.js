const Festival = require("../models/Festival");

class FestivalService {
  async createFestival(festivalData) {
    try {
      const festival = new Festival(festivalData);
      const savedFestival = await festival.save();
      return savedFestival;
    } catch (error) {
      console.error("FestivalService: Error creating festival:", error);
      throw error;
    }
  }

  async getAllFestivals() {
    try {
      const festivals = await Festival.find().sort({ createdAt: -1 });
      return festivals;
    } catch (error) {
      console.error("FestivalService: Error fetching festivals:", error);
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
      console.error("FestivalService: Error fetching active festival:", error);
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
      console.error("FestivalService: Error fetching festival by ID:", error);
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
      console.error("FestivalService: Error updating festival:", error);
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
      console.error("FestivalService: Error deleting festival:", error);
      throw error;
    }
  }
}

module.exports = new FestivalService();
