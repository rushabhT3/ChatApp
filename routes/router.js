const express = require("express");
const multer = require("multer");
const router = express.Router();
const upload = multer();

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
  upload.any(),
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

router.get(
  "/search",
  userauthentication.authenticate,
  groupController.searchedMembers
);

router.post(
  "/addMember",
  userauthentication.authenticate,
  groupController.addMember
);

router.delete("/deleteMember/:memberId&:groupId", groupController.deleteMember);

router.post("/makeAdmin", groupController.makeAdmin);

module.exports = router;
