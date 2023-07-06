const express = require("express");
const cors = require("cors");
const path = require("path");
const { createServer } = require("http");

// ! app instance बनाया जाता है, और createServer function को call करके app instance को pass करते हुए एक नया httpServer instance बनाया जाता है।
const app = express();
const httpServer = createServer(app);

const dotenv = require("dotenv");
dotenv.config();

const entryRoutes = require("./routes/router");
const setupSocket = require("./socket");

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

setupSocket(httpServer);

const port = process.env.PORT || 3000;
sequelize
  .sync()
  .then(() => {
    // ! Using app.listen(3000) will not work here, as it creates a new HTTP server.
    httpServer.listen(port, () => {
      console.log(`Chat app: listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error synchronizing with the database:", error);
  });
