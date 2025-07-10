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
    infoPage.set(updateData);
  }
  await infoPage.save();
  return infoPage;
};
