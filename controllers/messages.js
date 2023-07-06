const { Op } = require("sequelize");

// ? M in the end of variables is for model
const MessageM = require("../models/messages");
const UserM = require("../models/users");

const { uploadToS3 } = require("../Services/s3services");

const sendMessage = async (req, res) => {
  try {
    const { context, groupId } = req.body;
    // console.log(req.body, req.files);
    // ? getting the email from the middleware
    const email = req.authUser.email;
    const user = await UserM.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const attachmentUrls = [];
    // console.log("req.file", req.files);
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // console.log({ buffer: file.buffer, originalname: file.originalname });
        const attachmentUrl = await uploadToS3(file.buffer, file.originalname);
        attachmentUrls.push(attachmentUrl);
      }
    }
    const message = await MessageM.create({
      UserId: user.id,
      text: context || "",
      GroupGroupId: groupId,
      attachment: JSON.stringify(attachmentUrls),
    });
    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while sending the message" });
  }
};

const getMessages = async (req, res) => {
  try {
    const id = req.query.id || 0;
    const groupId = req.query.groupId;
    const messages = await MessageM.findAll({
      where: {
        id: {
          // ? to use the sequelize function '>' than the given id
          [Op.gt]: id,
        },
        // ! groupId
        GroupGroupId: groupId,
      },
    });
    // console.log(messages);
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error getting messages" });
  }
};

module.exports = {
  sendMessage,
  getMessages,
};
