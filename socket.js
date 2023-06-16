const socketIo = require("socket.io");

function setupSocketIo(http) {
  const io = socketIo(http);

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Listen for events emitted by the client and handle them here

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
}

module.exports = setupSocketIo;
