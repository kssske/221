const router = require("express").Router();
const c = require("../controllers/studentController");
const auth = require("../middleware/authMiddleware");

router.get("/:number", auth, c.getData);

module.exports = router;
