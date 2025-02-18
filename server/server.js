const express = require("express");
require("dotenv").config({ path: "./server/.env" });
const cors = require("cors");
const ical = require("ical-generator").default;
const { sendCalendarInvite } = require("./emailService");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

function parseDateAndTime(dateStr, timeStr) {
  const [day, month, year] = (dateStr || "01-01-2025").split("-");
  const [hour, minute] = (timeStr || "09:00").split(":");
  return new Date(
    parseInt(year, 10),
    parseInt(month, 10) - 1,
    parseInt(day, 10),
    parseInt(hour, 10),
    parseInt(minute, 10)
  );
}

app.post("/generate-ical", async (req, res) => {
  try {
    const sendEmail = req.body.sendEmail || false;
    const summary = req.body.summary || "Neues Ereignis";
    const description = req.body.description || "Keine Beschreibung";
    const organizerEmail = req.body.organizer_email || "organizer@default.com";
    const attendeesEmails =
      req.body.attendees_emails?.length > 0
        ? req.body.attendees_emails
        : ["guest@default.com"];
    const location = req.body.location || "Wien, Österreich";
    const timeZone = req.body.time_zone || "Europe/Vienna";
    const startDate = req.body.start_date || "01-01-2025";
    const endDate = req.body.end_date || startDate;
    const startTime = req.body.start_time || "09:00";
    const endTime = req.body.end_time || "10:00";
    const recurring = req.body.recurring || false;

    const rawName = (req.body.organizer_name || "").trim();
    const name = rawName.length > 0 ? rawName : "Default Organizer";

    const start = parseDateAndTime(startDate, startTime);
    const end = parseDateAndTime(endDate, endTime);

    const calendar = ical({
      name: `${organizerEmail}'s Calendar`,
      timezone: timeZone,
    });

    let repeating;
    if (recurring) {
      const freq = req.body.recurrence?.frequency || "WEEKLY";
      const count = req.body.recurrence?.count || 4;
      repeating = { freq, count };
    }

    calendar.createEvent({
      start,
      end,
      summary,
      description,
      location,
      organizer: {
        name: name,
        email: organizerEmail,
      },
      attendees: attendeesEmails.map((email) => ({ email })),
      repeating,
    });

    const icsData = calendar.toString();

    if (sendEmail) {
      const subject = `${name} hat dich zu ${summary} eingeladen`;
      const emailText =
        req.body.emailText ||
        "Hallo, anbei findest du deine Kalender-Einladung als Anhang.";

      await sendCalendarInvite({
        to: attendeesEmails,
        subject,
        text: emailText,
        icsData,
      });

      return res.json({ message: "E-Mail gesendet." });
    } else {
      res.setHeader("Content-Type", "text/calendar; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="invite.ics"');
      res.send(icsData);
    }
  } catch (error) {
    console.error("Error generating file:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
