const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const dotenv = require("dotenv");
dotenv.config();

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

app.use((req, res) => {
  res.sendFile(path.join(__dirname, `public/${req.url}`));
});

Groups.belongsToMany(Users, { through: UserGroups });
Users.belongsToMany(Groups, { through: UserGroups });

Users.hasMany(Messages);
Messages.belongsTo(Users);

Groups.hasMany(Messages);
Messages.belongsTo(Groups);

// Add the following lines to set up the Socket.IO server
const http = require("http").createServer(app);
require("./socket")(http);

const port = process.env.PORT || 3000;
sequelize
  .sync()
  .then(() => {
    // Change app.listen to http.listen
    http.listen(port, () => {
      console.log(`Chat app: listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error synchronizing with database:", error);
  });
