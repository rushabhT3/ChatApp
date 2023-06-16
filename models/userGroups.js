const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const UserGroups = sequelize.define("UserGroups", {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    default: 0,
    allowNull: false,
  },
});
module.exports = UserGroups;

// const UserGroups = sequelize.define("UserGroups", {
//   id: {
//     type: DataTypes.INTEGER.UNSIGNED,
//     allowNull: false,
//     autoIncrement: true,
//     primaryKey: true,
//   },
//   isAdmin: {
//     type: DataTypes.BOOLEAN,
//     default: 0,
//     allowNull: false,
//   },
// });

// UserGroups.associate = (models) => {
//   // Define associations here
//   UserGroups.belongsTo(models.Users);
//   UserGroups.belongsTo(models.Groups);
// };

//

// module.exports = UserGroups;

// const usersGroups = sequelize.define("UserGroups", {});

// export default usersGroups;

// userId: {
//   type: DataTypes.INTEGER,
//   allowNull: false,
//   references: {
//     model: "Users",
//     key: "id",
//   },
// },
// groupId: {
//   type: DataTypes.INTEGER,
//   allowNull: false,
//   references: {
//     model: "Groups",
//     key: "groupId",
//   },
// },
// isAdmin: {
//   type: DataTypes.BOOLEAN,
//   allowNull: true,
// },
// | Model      | Association                | Target Model | Through Model | Foreign Key |
// |------------|----------------------------|--------------|---------------|-------------|
// | Users      | hasMany (1:many)           | Messages     |               |             |
// | Messages   | belongsTo (many:1)         | Users        |               |             |
// | Users      | belongsToMany (many:many)  | Groups       | UserGroups    | userId      |
// | Groups     | belongsToMany (many:many)  | Users        | UserGroups    | groupId     |
// | Groups     | hasMany (1:many)           | Messages     |               |             |
// | Messages   | belongsTo (many:1)         | Groups       |               |             |
