const express = require("express");
const router = express.Router();

const entryController = require("../controllers/users");

router.post("/signup", entryController.signup);
router.post("/login", entryController.login);
router.get("/random", entryController.random);

module.exports = router;
