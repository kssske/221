const express = require("express");
const { initDB } = require("./db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
require('dotenv').config();
const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", require("./routes/loginRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
(async () => {
  await initDB();

  app.listen(3000, () =>
    console.log("http://localhost:3000")
  );
})();
