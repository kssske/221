const express = require("express");
const { initDB } = require("./db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
require('dotenv').config(); //to use .env
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api", require("./routes/loginRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
(async () => {
  await initDB();

  app.listen(PORT, () =>
    console.log(`Server is running on port ${PORT}`)
  );
})();
