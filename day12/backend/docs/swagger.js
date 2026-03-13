const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const path = require("path");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Task Manager API v2",
            version: "2.0.0",
            description:
                "A robust API with persistent storage, auth-protected routes, input validation, and clear API documentation.",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
            {
                url: "/",
                description: "Production server",
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, "../routes/*.js")], // Absolute path for Vercel
};

const swaggerSpec = swaggerJsdoc(options);

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";

const setupSwagger = (app) => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customCssUrl: CSS_URL,
            customJs: [
                "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-bundle.js",
                "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui-standalone-preset.js"
            ],
            customSiteTitle: "Task Manager API Docs",
        })
    );
};

module.exports = setupSwagger;
