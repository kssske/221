const express = require("express");
const { initDB } = require("./1555/db");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use("/api/student", require("./1555/studentRoutes"));
app.use("/api/attendance", require("./1555/attendanceRoutes"));

(async () => {
  await initDB();

  app.listen(3000, () =>
    console.log("http://localhost:3000")
  );
})();
