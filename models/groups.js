const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../util/database");

const Groups = sequelize.define("Groups", {
  groupId: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  groupName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Groups;
