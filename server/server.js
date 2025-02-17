const express = require("express");
require("dotenv").config({ path: "./server/.env" });
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Endpoint for generating iCal files
app.post("/generate-ical", async (req, res) => {
  try {
    const apiKey = process.env.API_KEY;
    const apyUrl =
      "https://api.apyhub.com/generate/ical/file?output=invite.ics";

    const response = await fetch(apyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apy-token": apiKey,
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const icsBuffer = await response.arrayBuffer();

    res.setHeader("Content-Type", "text/calendar");
    res.setHeader("Content-Disposition", "attachment; filename=invite.ics");

    res.send(Buffer.from(icsBuffer));
  } catch (error) {
    console.error("Error generating file:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
