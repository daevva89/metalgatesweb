const Archive = require("../models/Archive");

class ArchiveService {
  async createArchive(archiveData) {
    try {
      const archive = new Archive(archiveData);
      await archive.save();
      return archive;
    } catch (error) {
      console.error("ArchiveService: Error creating archive:", error);
      throw error;
    }
  }

  async getAllArchives() {
    try {
      return await Archive.find().sort({ year: -1 });
    } catch (error) {
      console.error("ArchiveService: Error fetching archives:", error);
      throw error;
    }
  }

  async getArchiveById(archiveId) {
    try {
      const archive = await Archive.findById(archiveId);
      if (!archive) {
        throw new Error("Archive not found");
      }
      return archive;
    } catch (error) {
      console.error("ArchiveService: Error fetching archive:", error);
      throw error;
    }
  }

  async updateArchive(archiveId, updateData) {
    try {
      const archive = await Archive.findByIdAndUpdate(archiveId, updateData, {
        new: true,
      });
      if (!archive) {
        throw new Error("Archive not found");
      }
      return archive;
    } catch (error) {
      console.error("ArchiveService: Error updating archive:", error);
      throw error;
    }
  }

  async deleteArchive(archiveId) {
    try {
      const archive = await Archive.findByIdAndDelete(archiveId);
      if (!archive) {
        throw new Error("Archive not found");
      }
      // Note: This no longer deletes the image file from the server.
      // A separate cleanup mechanism might be needed in the future.
      return archive;
    } catch (error) {
      console.error("ArchiveService: Error deleting archive:", error);
      throw error;
    }
  }
}

module.exports = new ArchiveService();
