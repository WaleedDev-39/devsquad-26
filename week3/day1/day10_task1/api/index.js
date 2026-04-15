const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const path = require("path");
const taskRoutes = require("../routes/taskRoutes");
const { errorHandler, notFoundHandler } = require("../middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 8000;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description: "A simple Express Task Manager API",
    },
    servers: [
      {
        url: "http://localhost:8000",
        description: "Local Server",
      },
      {
        url: "https://week3-day1-task.vercel.app",
        description: "Production Server",
      },
    ],
  },
  // Use explicit path for documentation files to ensure they are picked up in the bundle
  apis: [path.join(__dirname, "..", "routes", "taskRoutes.js")],
};

const specs = swaggerJsDoc(options);

app.use(express.json());

// Routes
app.use("/api", taskRoutes);

// Swagger Docs UI
app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js",
    ],
  }),
);

// 404 Route Not Found
app.use(notFoundHandler);

// Generic Error Handler Middleware
app.use(errorHandler);

// Export the app for Vercel
module.exports = app;
