import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

let queryResult;
let queryType;

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => {
  try {
    const response = await axios.get(
      `https://mcsrranked.com/api/users/${req.body.playerName}`
    );

    const result = response.data;
    let playerName = req.body.playerName;

    switch (req.body.stats) {
      case "bestTime":
        let bestTime = result.data.statistics.total.bestTime.ranked;
        let minutes = Math.floor(bestTime / 60000);
        let seconds = Math.floor((bestTime % 60000) / 1000);
        let formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
        queryResult = minutes + ":" + formattedSeconds;
        queryType = "Fastest Time";
        break;

      case "winstreak":
        queryResult = result.data.statistics.total.highestWinStreak.ranked;
        queryType = "Best Winstreak";
        break;

      case "matches":
        queryResult = result.data.statistics.total.playedMatches.ranked;
        queryType = "Matches Played";
        break;

      case "wins":
        queryResult = result.data.statistics.total.wins.ranked;
        queryType = "Wins";
        break;

      case "loses":
        queryResult = result.data.statistics.total.loses.ranked;
        queryType = "Loses";
        break;

      default:
        break;
    }

    res.render("index.ejs", {
      name: playerName,
      type: queryType,
      data: queryResult,
    });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    res.render("index.ejs", { error: error.message });
  }
});

export default app;