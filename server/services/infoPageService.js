const InfoPage = require("../models/InfoPage");

// Get the info page content, create if it doesn't exist
exports.getInfoPage = async () => {
  let infoPage = await InfoPage.findOne();
  if (!infoPage) {
    infoPage = new InfoPage();
    await infoPage.save();
  }
  return infoPage;
};

// Update the info page content
exports.updateInfoPage = async (updateData) => {
  let infoPage = await InfoPage.findOne();
  if (!infoPage) {
    infoPage = new InfoPage(updateData);
  } else {
    // Be explicit to avoid Mongoose type coercion issues
    infoPage.location = updateData.location;
    infoPage.travel = updateData.travel;
    infoPage.rules = updateData.rules;
    infoPage.faq = updateData.faq;
  }
  await infoPage.save();
  return infoPage;
};
