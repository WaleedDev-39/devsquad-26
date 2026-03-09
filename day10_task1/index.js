const express = require("express");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const taskRoutes = require("./routes/taskRoutes");
const { errorHandler, notFoundHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = 8000;

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
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
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

app.listen(PORT, () => console.log(`Server started at: http://localhost:${PORT}`));
