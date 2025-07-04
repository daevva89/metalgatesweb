const Band = require('../models/Band');
const FileUploadUtil = require('../utils/fileUpload');
const ImageCleanupUtil = require('../utils/imageCleanup');

class BandService {
  async createBand(bandData) {
    try {
      console.log('BandService: Creating new band');
      
      // Handle image upload if provided
      let imagePath = null;
      if (bandData.image) {
        console.log('BandService: Processing band image upload');
        imagePath = await FileUploadUtil.saveBase64Image(bandData.image, 'band');
        console.log('BandService: Band image saved successfully');
      }

      const band = new Band({
        name: bandData.name,
        country: bandData.country,
        image: imagePath,
        biography: bandData.biography,
        spotifyEmbed: bandData.spotifyEmbed || '',
        socialLinks: {
          facebook: bandData.facebook || '',
          instagram: bandData.instagram || '',
          youtube: bandData.youtube || '',
          bandcamp: bandData.bandcamp || ''
        }
      });

      const savedBand = await band.save();
      console.log('BandService: Band created successfully');
      
      // Convert image path to URL for response
      const response = savedBand.toObject();
      if (response.image) {
        response.image = FileUploadUtil.getImageUrl(response.image);
      }
      
      return response;
    } catch (error) {
      console.error('BandService: Error creating band:', error);
      throw error;
    }
  }

  async getAllBands() {
    try {
      console.log('BandService: Fetching all bands');
      const bands = await Band.find().sort({ createdAt: -1 });
      console.log(`BandService: Found ${bands.length} bands`);
      
      // Convert image paths to URLs
      const bandsWithUrls = bands.map(band => {
        const bandObj = band.toObject();
        if (bandObj.image) {
          bandObj.image = FileUploadUtil.getImageUrl(bandObj.image);
        }
        return bandObj;
      });
      
      return bandsWithUrls;
    } catch (error) {
      console.error('BandService: Error fetching bands:', error);
      throw error;
    }
  }

  async getBandById(bandId) {
    try {
      console.log('BandService: Fetching band by ID:', bandId);
      const band = await Band.findById(bandId);
      
      if (!band) {
        throw new Error('Band not found');
      }

      console.log('BandService: Band found');
      
      // Convert image path to URL
      const response = band.toObject();
      if (response.image) {
        response.image = FileUploadUtil.getImageUrl(response.image);
      }
      
      return response;
    } catch (error) {
      console.error('BandService: Error fetching band:', error);
      throw error;
    }
  }

  async updateBand(bandId, updateData) {
    try {
      console.log('BandService: Updating band:', bandId);
      
      const existingBand = await Band.findById(bandId);
      if (!existingBand) {
        throw new Error('Band not found');
      }

      // Handle image update if provided
      let imagePath = existingBand.image;
      if (updateData.image !== undefined) {
        if (updateData.image) {
          console.log('BandService: Processing band image update');
          imagePath = await FileUploadUtil.saveBase64Image(updateData.image, 'band', existingBand.image);
          console.log('BandService: Band image updated successfully');
        } else {
          // Remove image
          if (existingBand.image) {
            await ImageCleanupUtil.cleanupBandImages(existingBand);
          }
          imagePath = null;
          console.log('BandService: Band image removed');
        }
      }

      const updatedBand = await Band.findByIdAndUpdate(
        bandId,
        {
          name: updateData.name,
          country: updateData.country,
          image: imagePath,
          biography: updateData.biography,
          spotifyEmbed: updateData.spotifyEmbed || '',
          socialLinks: {
            facebook: updateData.facebook || '',
            instagram: updateData.instagram || '',
            youtube: updateData.youtube || '',
            bandcamp: updateData.bandcamp || ''
          }
        },
        { new: true }
      );

      console.log('BandService: Band updated successfully');
      
      // Convert image path to URL for response
      const response = updatedBand.toObject();
      if (response.image) {
        response.image = FileUploadUtil.getImageUrl(response.image);
      }
      
      return response;
    } catch (error) {
      console.error('BandService: Error updating band:', error);
      throw error;
    }
  }

  async deleteBand(bandId) {
    try {
      console.log('BandService: Deleting band:', bandId);
      
      const band = await Band.findById(bandId);
      if (!band) {
        throw new Error('Band not found');
      }

      // Clean up associated images
      await ImageCleanupUtil.cleanupBandImages(band);

      await Band.findByIdAndDelete(bandId);
      console.log('BandService: Band deleted successfully');
      
      return band;
    } catch (error) {
      console.error('BandService: Error deleting band:', error);
      throw error;
    }
  }
}

module.exports = new BandService();