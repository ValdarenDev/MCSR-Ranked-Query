import express, { response } from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

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
    res.render("index.ejs", {
      error: error.message,
    });
  }

  res;
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
