const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Attendance API",
            version: "1.0.0",
            description: "出席管理システムAPI"
        },
        servers: [
            {
                url: "http://localhost:3000"
            }
        ]
    },
    apis: ["./1555/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;