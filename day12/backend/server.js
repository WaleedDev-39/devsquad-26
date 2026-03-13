require("dotenv").config();
const express = require("express");
const { connectMongoDB } = require("./db");

// Routes
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Swagger Docs
const setupSwagger = require("./docs/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
const mongoUrl =
  process.env.MONGO_URL || "mongodb://127.0.0.1:27017/devsquad26";

console.log("Using MongoDB URL:", mongoUrl);
if (!process.env.MONGO_URL) {
  console.warn(
    "MONGO_URL is not set. Using fallback local MongoDB URL:",
    mongoUrl,
  );
}

connectMongoDB(mongoUrl)
  .then(() => {
    console.log("MongoDB connected successfully!!");

    // Setup Swagger Documentation
    setupSwagger(app);

    // Use Routes
    app.use("/api/users", authRoutes);
    app.use("/api/tasks", taskRoutes);

    app.listen(PORT, () => {
      console.log(`Server started at port:${PORT}`);
      console.log(
        `Swagger Docs available at http://localhost:${PORT}/api-docs`,
      );
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

module.exports = app;
