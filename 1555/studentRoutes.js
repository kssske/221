const router = require("express").Router();
const c = require("./studentController");
const auth = require("./authMiddleware");

router.get("/:number", auth, c.getData);

module.exports = router;
