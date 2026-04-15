require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]); // Force Google DNS to resolve MongoDB Atlas SRV records
const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("./db");

// Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Swagger Docs
const setupSwagger = require("./docs/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection (performed per-request; requires middleware to ensure connected before handlers)
const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/devsquad26";

const maskedMongoUrl = mongoUrl.replace(
  /(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)(@.*)/,
  "$1*****$3",
);
console.log("Using MongoDB URL:", maskedMongoUrl);
if (!process.env.MONGO_URL) {
  console.warn(
    "MONGO_URL is not set. Using fallback local MongoDB URL:",
    mongoUrl,
  );
}

let connectPromise = null;
const ensureDbConnected = async (req, res, next) => {
  try {
    if (!connectPromise) {
      connectPromise = connectMongoDB(mongoUrl);
    }
    await connectPromise;
    return next();
  } catch (err) {
    console.error("MongoDB connection error (request):", err);
    return res.status(500).json({
      errors: [{ msg: "Database connection error. Please try again later." }],
    });
  }
};

app.use(ensureDbConnected);

// Setup Swagger Documentation
setupSwagger(app);

// Use Routes
app.use("/api/users", authRoutes);
app.use("/api/tasks", taskRoutes);

// For Vercel serverless
module.exports = app;
