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
connectMongoDB(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected successfully!!"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Setup Swagger Documentation
setupSwagger(app);

// Use Routes
app.use("/api/users", authRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => {
  console.log(`Server started at port:${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});
