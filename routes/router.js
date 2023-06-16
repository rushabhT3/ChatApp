const express = require("express");
const router = express.Router();

const userauthentication = require("../middlewares/auth");

const entryController = require("../controllers/users");
const messageController = require("../controllers/messages");
const groupController = require("../controllers/groups");

router.post("/signup", entryController.signup);
router.post("/login", entryController.login);
router.get("/random", entryController.random);

router.post(
  "/sendMessage",
  userauthentication.authenticate,
  messageController.sendMessage
);

router.get(
  "/getMessages",
  userauthentication.authenticate,
  messageController.getMessages
);
router.get("/getGroups", groupController.getGroups);
router.get("/getGroupDetail", groupController.getGroupDetail);

router.post(
  "/makeGroup",
  userauthentication.authenticate,
  groupController.makeGroup
);

module.exports = router;
