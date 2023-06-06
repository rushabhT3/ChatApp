const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/users");

exports.authenticate = async (req, res, next) => {
  try {
    const token = req.header("Authorization"); // ? gets token from this named request header
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    // ? findByPk method is used to find a record by its primary key
    const authUser = await User.findOne({ where: { email: user.email } });
    req.authUser = authUser; // ? This adds the user's information to the request so we can use it later
    next();
  } catch (error) {
    console.log(["middleware not working", error]);
  }
};
