const express = require("express");
const cors = require("cors");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const multer = require("multer");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
  /* options */
});

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

/* 
! This sets up an event listener for the "connection" event.
! When a client connects to the server, the callback function is called 
! with a socket object representing the connection.
*/
io.on("connection", (socket) => {
  console.log("BE: io.on connection");

  socket.on("sendMessage", (message) => {
    io.emit("messageReceived");
  });

  socket.on("createGroup", (group) => {
    io.emit("groupUpdated");
  });

  socket.on("memberAdded", () => {
    io.emit("groupUpdated");
  });
});

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
