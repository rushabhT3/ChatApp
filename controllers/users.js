const { User } = require("../models/users");

const signup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const newUser = await User.create({ name, email, phone, password });
    res.json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;
};

const random = (req, res) => {
  res.send("this is the random one");
};

module.exports = {
  signup,
  login,
  random,
};
