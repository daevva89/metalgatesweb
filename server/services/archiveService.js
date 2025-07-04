const Archive = require('../models/Archive');
const FileUploadUtil = require('../utils/fileUpload');
const ImageCleanupUtil = require('../utils/imageCleanup');

class ArchiveService {
  async createArchive(archiveData) {
    try {
      console.log('ArchiveService: Creating new archive');

      // Handle poster upload if provided
      let posterPath = null;
      if (archiveData.poster) {
        console.log('ArchiveService: Processing archive poster upload');
        posterPath = await FileUploadUtil.saveBase64Image(archiveData.poster, 'archive');
        console.log('ArchiveService: Archive poster saved successfully');
      }

      const archive = new Archive({
        year: archiveData.year,
        poster: posterPath,
        lineup: archiveData.lineup,
        description: archiveData.description
      });

      const savedArchive = await archive.save();
      console.log('ArchiveService: Archive created successfully');

      // Convert poster path to URL for response
      const response = savedArchive.toObject();
      if (response.poster) {
        response.poster = FileUploadUtil.getImageUrl(response.poster);
      }

      return response;
    } catch (error) {
      console.error('ArchiveService: Error creating archive:', error);
      throw error;
    }
  }

  async getAllArchives() {
    try {
      console.log('ArchiveService: Fetching all archives');
      const archives = await Archive.find().sort({ year: -1 });
      console.log(`ArchiveService: Found ${archives.length} archives`);

      // Convert poster paths to URLs
      const archivesWithUrls = archives.map(archive => {
        const archiveObj = archive.toObject();
        if (archiveObj.poster) {
          archiveObj.poster = FileUploadUtil.getImageUrl(archiveObj.poster);
        }
        return archiveObj;
      });

      return archivesWithUrls;
    } catch (error) {
      console.error('ArchiveService: Error fetching archives:', error);
      throw error;
    }
  }

  async getArchiveById(archiveId) {
    try {
      console.log('ArchiveService: Fetching archive by ID:', archiveId);
      const archive = await Archive.findById(archiveId);

      if (!archive) {
        throw new Error('Archive not found');
      }

      console.log('ArchiveService: Archive found');

      // Convert poster path to URL
      const response = archive.toObject();
      if (response.poster) {
        response.poster = FileUploadUtil.getImageUrl(response.poster);
      }

      return response;
    } catch (error) {
      console.error('ArchiveService: Error fetching archive:', error);
      throw error;
    }
  }

  async updateArchive(archiveId, updateData) {
    try {
      console.log('ArchiveService: Updating archive:', archiveId);

      const existingArchive = await Archive.findById(archiveId);
      if (!existingArchive) {
        throw new Error('Archive not found');
      }

      // Handle poster update if provided
      let posterPath = existingArchive.poster;
      if (updateData.poster !== undefined) {
        if (updateData.poster) {
          console.log('ArchiveService: Processing archive poster update');
          posterPath = await FileUploadUtil.saveBase64Image(updateData.poster, 'archive', existingArchive.poster);
          console.log('ArchiveService: Archive poster updated successfully');
        } else {
          // Remove poster
          if (existingArchive.poster) {
            await ImageCleanupUtil.cleanupArchiveImages(existingArchive);
          }
          posterPath = null;
          console.log('ArchiveService: Archive poster removed');
        }
      }

      const updatedArchive = await Archive.findByIdAndUpdate(
        archiveId,
        {
          year: updateData.year,
          poster: posterPath,
          lineup: updateData.lineup,
          description: updateData.description
        },
        { new: true }
      );

      console.log('ArchiveService: Archive updated successfully');

      // Convert poster path to URL for response
      const response = updatedArchive.toObject();
      if (response.poster) {
        response.poster = FileUploadUtil.getImageUrl(response.poster);
      }

      return response;
    } catch (error) {
      console.error('ArchiveService: Error updating archive:', error);
      throw error;
    }
  }

  async deleteArchive(archiveId) {
    try {
      console.log('ArchiveService: Deleting archive:', archiveId);

      const archive = await Archive.findById(archiveId);
      if (!archive) {
        throw new Error('Archive not found');
      }

      // Clean up associated images
      await ImageCleanupUtil.cleanupArchiveImages(archive);

      await Archive.findByIdAndDelete(archiveId);
      console.log('ArchiveService: Archive deleted successfully');

      return archive;
    } catch (error) {
      console.error('ArchiveService: Error deleting archive:', error);
      throw error;
    }
  }
}

module.exports = new ArchiveService();