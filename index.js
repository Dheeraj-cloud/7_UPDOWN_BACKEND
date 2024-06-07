// backend/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { db } = require("./Database/db");
const userRoutes = require("./Routes/User");
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow credentials (cookies)
  })
);
app.use(cookieParser("1234"));
app.use("/api/user", userRoutes);

let userPoints = 5000;

// Function to simulate rolling the dice
const rollDice = () => {
  const dice1 = Math.floor(Math.random() * 6) + 1;
  const dice2 = Math.floor(Math.random() * 6) + 1;
  return { dice1, dice2, sum: dice1 + dice2 };
};

// Endpoint to roll the dice
app.post("/api/roll-dice", (req, res) => {
  const result = rollDice();
  res.json(result);
});

// Endpoint to update points based on the game result
app.post("/api/update-points", (req, res) => {
  const { bet, option, result } = req.body;
  const sum = result.sum;

  if ((option === "7 Down" && sum < 7) || (option === "7 Up" && sum > 7)) {
    userPoints += bet;
  } else if (option === "Lucky 7" && sum === 7) {
    userPoints += bet * 5;
  } else {
    userPoints -= bet;
  }

  res.json({ points: userPoints });
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
