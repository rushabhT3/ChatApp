const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Messages = sequelize.define("Messages", {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Messages;
