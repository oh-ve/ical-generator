const transporter = require("../server/smtpConfig");

async function testEmail() {
  try {
    let info = await transporter.sendMail({
      from: process.env.GMAIL_ADDRESS,
      to: process.env.USER_EMAIL,
      subject: "Testing Gmail + NodeMailer",
      text: "Hello! This is a test email sent via Gmail and NodeMailer.",
    });
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

testEmail();
