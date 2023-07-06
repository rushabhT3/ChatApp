const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const ArchivedChat = sequelize.define("ArchivedChat", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  text: DataTypes.STRING,
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  UserId: DataTypes.INTEGER,
  GroupGroupId: DataTypes.INTEGER,
  attachment: DataTypes.STRING,
});

module.exports = ArchivedChat;
