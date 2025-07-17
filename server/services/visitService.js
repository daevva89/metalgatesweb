const Visit = require("../models/Visit");

class VisitService {
  async logVisit(visitData) {
    try {
      const visit = new Visit(visitData);
      await visit.save();
      return visit;
    } catch (error) {
      throw error;
    }
  }

  async getVisitStats(timeframe = "30d") {
    try {
      const now = new Date();
      let startDate;

      switch (timeframe) {
        case "24h":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
        default:
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
      }

      const totalVisits = await Visit.countDocuments({
        timestamp: { $gte: startDate },
      });

      const uniqueVisitors = await Visit.distinct("ip", {
        timestamp: { $gte: startDate },
      });

      const topPages = await Visit.aggregate([
        { $match: { timestamp: { $gte: startDate } } },
        { $group: { _id: "$page", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]);

      return {
        totalVisits,
        uniqueVisitors: uniqueVisitors.length,
        topPages,
        timeframe,
      };
    } catch (error) {
      throw error;
    }
  }

  async getTotalVisits() {
    try {
      const total = await Visit.countDocuments();
      return total;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new VisitService();
