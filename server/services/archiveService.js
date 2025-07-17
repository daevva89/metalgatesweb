const Archive = require("../models/Archive");

class ArchiveService {
  async createArchive(archiveData) {
    try {
      const archive = new Archive(archiveData);
      const savedArchive = await archive.save();
      return savedArchive;
    } catch (error) {
      throw error;
    }
  }

  async getAllArchives() {
    try {
      const archives = await Archive.find().sort({ year: -1 });
      return archives;
    } catch (error) {
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
      throw error;
    }
  }

  async updateArchive(archiveId, updateData) {
    try {
      const archive = await Archive.findByIdAndUpdate(archiveId, updateData, {
        new: true,
        runValidators: true,
      });
      if (!archive) {
        throw new Error("Archive not found");
      }
      return archive;
    } catch (error) {
      throw error;
    }
  }

  async deleteArchive(archiveId) {
    try {
      const archive = await Archive.findByIdAndDelete(archiveId);
      if (!archive) {
        throw new Error("Archive not found");
      }
      return archive;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ArchiveService();
