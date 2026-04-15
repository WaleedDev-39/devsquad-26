const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const taskRoutes = require("./routes/taskRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

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
  apis: [require("path").join(__dirname, "routes", "taskRoutes.js")],
};

const specs = swaggerJsDoc(options);

app.use(express.json());

// Routes
app.use("/api", taskRoutes);

// Swagger Docs UI
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// 404 Route Not Found
app.use(notFoundHandler);

// Generic Error Handler Middleware
app.use(errorHandler);

// Only start the HTTP server when this file is run directly (local development).
// if (require.main === module) {
//   app.listen(PORT, () =>
//     console.log(`Server started at: http://localhost:${PORT}`),
//   );
// }

// Export a handler for serverless platforms (Vercel).
module.exports = app;
