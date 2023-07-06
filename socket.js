const { Server } = require("socket.io");

module.exports = (httpServer) => {
  // ? Server का एक नया instance बनाया जाता है,
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
    /* options */
  });

  // ? io object पर "connection" event के लिए एक event listener set up
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
};
