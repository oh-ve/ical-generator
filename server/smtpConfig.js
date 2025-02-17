const nodemailer = require("nodemailer");
require("dotenv").config({ path: "./server/.env" });

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_PASS,
  },
});

module.exports = transporter;
