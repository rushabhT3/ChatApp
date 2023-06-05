// ? M in the end of variables is for model
const MessageM = require("../models/messages");
const UserM = require("../models/users");

const sendMessage = async (req, res) => {
  try {
    const { context } = req.body;
    // ? getting the email from the middleware
    const email = req.authUser.email;
    const user = await UserM.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const message = await MessageM.create({
      UserId: user.id,
      text: context,
    });
    res.status(201).json({ message });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while sending the message" });
  }
};

module.exports = {
  sendMessage,
};
