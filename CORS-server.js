const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/jira", async (req, res) => {
  try {
    const jiraURL = `https://YOUR-URL/rest/api/2/search?jql=${req.body.jiraParams}`;
    const authBase64 = Buffer.from(req.body.auth).toString("base64");
    const headers = {
      Accept: "application/json",
      Authorization: `Basic ${authBase64}`,
    };

    const response = await axios.get(jiraURL, { headers });
    res.json(response.data);
  } catch (error) {
    console.error("Error in /jira route:", error);
    console.error("Error details:", error.response?.data);
    res.status(500).json({ error: error.toString() });
  }
});

const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});