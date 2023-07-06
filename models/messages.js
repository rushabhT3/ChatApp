const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Messages = sequelize.define("Messages", {
  text: {
    type: DataTypes.STRING,
  },
  attachment: {
    type: DataTypes.STRING,
  },
});

module.exports = Messages;
