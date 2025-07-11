const nodemailer = require("nodemailer");

const emailConfig = {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

const contactFormToEmail = process.env.CONTACT_FORM_TO_EMAIL;
const emailFrom = process.env.EMAIL_FROM;

module.exports = {
  transporter,
  contactFormToEmail,
  emailFrom,
};
