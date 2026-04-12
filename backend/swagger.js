const swaggerJsdoc = require("swagger-jsdoc");
const serverUrl = process.env.RENDER_EXTERNAL_URL
    ? process.env.RENDER_EXTERNAL_URL
    : "http://localhost:3000";
const options = {
    definition: {
        openapi: "3.0.0",
        info: { title: "API Documentation", version: "1.0.0" },
        servers: [
            {
                url: serverUrl,
                description: process.env.RENDER_EXTERNAL_URL ? "Production" : "Local"
            }
        ],
    },
    apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;