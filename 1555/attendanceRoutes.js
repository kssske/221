const router = require("express").Router();
const c = require("./attendanceController");
const auth = require("./authMiddleware");
router.post("/", auth, c.validateMark, c.mark);

module.exports = router;
