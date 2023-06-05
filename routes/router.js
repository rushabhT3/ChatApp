const express = require("express");
const router = express.Router();

const userauthentication = require("../middlewares/auth");

const entryController = require("../controllers/users");
const messageController = require("../controllers/messages");

router.post("/signup", entryController.signup);
router.post("/login", entryController.login);
router.get("/random", entryController.random);

router.post(
  "/sendMessage",
  userauthentication.authenticate,
  messageController.sendMessage
);

module.exports = router;
