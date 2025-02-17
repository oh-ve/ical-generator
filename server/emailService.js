const transporter = require("./smtpConfig");

async function sendCalendarInvite({ to, subject, text, icsData }) {
  const mailOptions = {
    from: process.env.GMAIL_ADDRESS,
    to,
    subject,
    text,
    attachments: [
      {
        filename: "invite.ics",
        content: icsData,
        contentType: "text/calendar",
      },
    ],
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendCalendarInvite };
