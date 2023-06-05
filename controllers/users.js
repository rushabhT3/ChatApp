const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/users");

const signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (name && email && phone && password) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(409).json({ message: "User already exists, Please Login" });
      } else {
        // ? making the encrypted password with the saltrounds
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          name,
          email,
          phone,
          password: hashedPassword,
        });
        res.json(newUser);
      }
    } else {
      res.status(400).json({ message: "All fields are required" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user" });
  }
};

const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET);
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ where: { email } });
      // ? bcrypt decoding: inserted and the encrypted password
      if (user && (await bcrypt.compare(password, user.password))) {
        // ? Generate JWT & Send the JWT in the response
        const token = generateAccessToken({ email: user.email });
        res.json({ user, token });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(400).json({ message: "Email and password are required" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in" });
  }
};

const random = (req, res) => {
  res.send("this is the random one");
};

module.exports = {
  signup,
  login,
  generateAccessToken,
  random,
};
