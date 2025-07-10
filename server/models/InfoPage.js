const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const infoPageSchema = new mongoose.Schema(
  {
    location: {
      title: { type: String, default: "Quantic Club, Bucharest" },
      address: {
        type: String,
        default: "Strada Blanari 14, Bucharest 030167, Romania",
      },
      mapEmbedUrl: { type: String, default: "" },
    },
    travel: {
      byAir: { type: String, default: "" },
      byCar: { type: String, default: "" },
      accommodation: { type: String, default: "" },
    },
    rules: {
      importantGuidelines: { type: String, default: "" },
      allowedItems: [{ type: String }],
      prohibitedItems: [{ type: String }],
      securityNote: { type: String, default: "" },
    },
    faq: [faqSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("InfoPage", infoPageSchema);
