const express = require("express");
const { initDB } = require("./db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
require('dotenv').config(); //to use .env
const rateLimit = require("express-rate-limit");
const PORT = process.env.PORT || 3000;
const app = express();
const loginLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 1時間
  max: 5,
  message: { error: "ログイン試行回数が上限を超えました" }
});
app.use(require("cors")());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/login", loginLimiter);
app.use("/api", require("./routes/loginRoutes"));
app.use("/api/student", require("./routes/studentRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
(async () => {
  await initDB();

  app.listen(PORT, "0.0.0.0", () =>
    console.log(`Server is running on port ${PORT}`)
  );
})();
