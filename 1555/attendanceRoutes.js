const router = require("express").Router();
const c = require("./attendanceController");

router.post("/", c.validateMark, c.mark);

module.exports = router;
