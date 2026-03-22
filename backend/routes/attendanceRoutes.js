const router = require("express").Router();
const c = require("../controllers/attendanceController");
const auth = require("../middleware/authMiddleware");
router.post("/", auth, c.validateMark, c.mark);

module.exports = router;
