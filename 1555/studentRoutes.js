const router = require("express").Router();
const c = require("./studentController");

router.get("/:number", c.getData);

module.exports = router;
