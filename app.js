const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const entryRoutes = require("./routes/router");
const sequelize = require("./util/database");

const Users = require("./models/users");
const Messages = require("./models/messages");
const Groups = require("./models/groups");
const UserGroups = require("./models/userGroups");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use("/", entryRoutes);

// Groups.belongsToMany(Users, { through: UserGroups });
// Users.belongsToMany(Groups, { through: UserGroups });

// Users.hasMany(Messages);
// Messages.belongsTo(Users);

// Groups.hasMany(Messages);
// Messages.belongsTo(Groups);

Groups.associate = (models) => {
  Groups.belongsToMany(models.Users, {
    through: models.UserGroups,
  });
  Groups.hasMany(models.Messages);
};

Users.associate = (models) => {
  Users.belongsToMany(models.Groups, {
    through: models.UserGroups,
  });
  Users.hasMany(models.Messages);
};

Messages.associate = (models) => {
  Messages.belongsTo(models.Users);
  Messages.belongsTo(models.Groups);
};

// sequelize
//   .sync()
//   .then(() => {
//     app.listen(port, () => {
//       console.log(`Chat app: listening on port ${port}`);
//     });
//   })
//   .catch((error) => {
//     console.error("Error synchronizing with database:", error);
//   });

// Call the associate function for each model
Groups.associate({ Users, UserGroups, Messages });
Users.associate({ Groups, UserGroups, Messages });
Messages.associate({ Users, Groups });

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Chat app: listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error synchronizing with database:", error);
  });
