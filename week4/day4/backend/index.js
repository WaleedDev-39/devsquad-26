const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const matches = require("./data");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// ---------- REST API ----------

// GET all matches
app.get("/api/matches", (req, res) => {
  res.json(matches);
});

// GET single match
app.get("/api/matches/:id", (req, res) => {
  const match = matches.find((m) => m.id === parseInt(req.params.id));
  if (!match) return res.status(404).json({ message: "Match not found" });
  res.json(match);
});

// ---------- Socket.IO ----------

io.on("connection", (socket) => {
  console.log("⚡ Client connected:", socket.id);

  // Send current matches on connect
  socket.emit("initialData", matches);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// ---------- Score Simulator ----------

function simulateScoreUpdate() {
  // Get only live matches
  const liveMatches = matches.filter((m) => m.status === "live");
  if (liveMatches.length === 0) return;

  // Pick a random live match
  const match = liveMatches[Math.floor(Math.random() * liveMatches.length)];

  // Randomly pick which team scores
  const scoringTeam = Math.random() > 0.5 ? "score1" : "score2";

  // Increment based on sport
  if (match.sport === "Football") {
    match[scoringTeam] += 1;
    match.minute = Math.min((match.minute || 0) + Math.floor(Math.random() * 10) + 1, 90);
  } else if (match.sport === "Cricket") {
    match[scoringTeam] += Math.floor(Math.random() * 6) + 1; // 1-6 runs
    // Update overs
    const currentOver = parseFloat(match.over || "0");
    const balls = Math.round((currentOver % 1) * 10);
    if (balls >= 5) {
      match.over = (Math.floor(currentOver) + 1).toString() + ".0";
    } else {
      match.over = Math.floor(currentOver) + "." + (balls + 1);
    }
  } else if (match.sport === "Basketball") {
    const points = [1, 2, 2, 2, 3][Math.floor(Math.random() * 5)]; // weighted toward 2-pointers
    match[scoringTeam] += points;
  }

  const update = {
    matchId: match.id,
    score1: match.score1,
    score2: match.score2,
    minute: match.minute,
    over: match.over,
    quarter: match.quarter,
  };

  console.log(
    `🏆 Score Update: ${match.team1.name} ${match.score1} - ${match.score2} ${match.team2.name}`
  );

  io.emit("scoreUpdate", update);
}

// Update scores every 8-15 seconds
setInterval(() => {
  simulateScoreUpdate();
}, Math.floor(Math.random() * 7000) + 8000);

// Also run a fixed interval as backup (the random one above only sets delay once)
setInterval(simulateScoreUpdate, 10000);

// ---------- Start Server ----------

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
