const Visit = require("../models/Visit");

class VisitService {
  async logVisit({ ip }) {
    try {
      const visit = new Visit({ ip });
      await visit.save();
      return visit;
    } catch (error) {
      console.error("Error logging visit:", error);
      throw error;
    }
  }

  async getVisitorStats() {
    try {
      const today = new Date();
      const firstDayOfCurrentMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const firstDayOfLastMonth = new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        1
      );

      // Total unique visitors (based on IP)
      const totalVisitors = (await Visit.distinct("ip")).length;

      // Unique visitors this month
      const currentMonthVisitors = await Visit.distinct("ip", {
        timestamp: { $gte: firstDayOfCurrentMonth },
      });
      const currentMonthVisitorsCount = currentMonthVisitors.length;

      // Unique visitors last month
      const lastMonthVisitors = await Visit.distinct("ip", {
        timestamp: { $gte: firstDayOfLastMonth, $lt: firstDayOfCurrentMonth },
      });
      const lastMonthVisitorsCount = lastMonthVisitors.length;

      // Calculate percentage change
      let percentageChange = 0;
      if (lastMonthVisitorsCount > 0) {
        percentageChange =
          ((currentMonthVisitorsCount - lastMonthVisitorsCount) /
            lastMonthVisitorsCount) *
          100;
      } else if (currentMonthVisitorsCount > 0) {
        percentageChange = 100; // If last month was 0 and this month has visitors
      }

      return {
        totalVisitors,
        percentageChange: parseFloat(percentageChange.toFixed(1)),
      };
    } catch (error) {
      console.error("Error getting visitor stats:", error);
      throw { message: "Failed to retrieve visitor statistics." };
    }
  }
}

module.exports = new VisitService();
