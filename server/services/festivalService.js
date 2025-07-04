const Festival = require('../models/Festival');

class FestivalService {
  async createFestival(festivalData) {
    console.log('FestivalService: Creating new festival:', festivalData.name);
    try {
      const festival = new Festival(festivalData);
      const savedFestival = await festival.save();
      console.log('FestivalService: Festival created successfully with ID:', savedFestival._id);
      return savedFestival;
    } catch (error) {
      console.error('FestivalService: Error creating festival:', error.message);
      throw new Error(`Failed to create festival: ${error.message}`);
    }
  }

  async getAllFestivals() {
    console.log('FestivalService: Fetching all festivals');
    try {
      const festivals = await Festival.find().sort({ createdAt: -1 });
      console.log(`FestivalService: Found ${festivals.length} festivals`);
      return festivals;
    } catch (error) {
      console.error('FestivalService: Error fetching festivals:', error.message);
      throw new Error(`Failed to fetch festivals: ${error.message}`);
    }
  }

  async getActiveFestival() {
    console.log('FestivalService: Fetching active festival');
    try {
      const festival = await Festival.findOne({ isActive: true }).sort({ createdAt: -1 });
      if (!festival) {
        console.log('FestivalService: No active festival found');
        throw new Error('No active festival found');
      }
      console.log('FestivalService: Active festival found:', festival.name);
      return festival;
    } catch (error) {
      console.error('FestivalService: Error fetching active festival:', error.message);
      throw new Error(`Failed to fetch active festival: ${error.message}`);
    }
  }

  async getFestivalById(festivalId) {
    console.log('FestivalService: Fetching festival by ID:', festivalId);
    try {
      const festival = await Festival.findById(festivalId);
      if (!festival) {
        console.log('FestivalService: Festival not found with ID:', festivalId);
        throw new Error('Festival not found');
      }
      console.log('FestivalService: Festival found:', festival.name);
      return festival;
    } catch (error) {
      console.error('FestivalService: Error fetching festival:', error.message);
      throw new Error(`Failed to fetch festival: ${error.message}`);
    }
  }

  async updateFestival(festivalId, updateData) {
    console.log('FestivalService: Updating festival with ID:', festivalId);
    try {
      const festival = await Festival.findByIdAndUpdate(
        festivalId,
        { ...updateData, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      if (!festival) {
        console.log('FestivalService: Festival not found for update with ID:', festivalId);
        throw new Error('Festival not found');
      }
      console.log('FestivalService: Festival updated successfully:', festival.name);
      return festival;
    } catch (error) {
      console.error('FestivalService: Error updating festival:', error.message);
      throw new Error(`Failed to update festival: ${error.message}`);
    }
  }

  async deleteFestival(festivalId) {
    console.log('FestivalService: Deleting festival with ID:', festivalId);
    try {
      const festival = await Festival.findByIdAndDelete(festivalId);
      if (!festival) {
        console.log('FestivalService: Festival not found for deletion with ID:', festivalId);
        throw new Error('Festival not found');
      }
      console.log('FestivalService: Festival deleted successfully:', festival.name);
      return festival;
    } catch (error) {
      console.error('FestivalService: Error deleting festival:', error.message);
      throw new Error(`Failed to delete festival: ${error.message}`);
    }
  }
}

module.exports = new FestivalService();