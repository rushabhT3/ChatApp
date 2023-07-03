module.exports = (http) => {
  const io = require("socket.io")(http, {
    cors: {
      origin: "http://127.0.0.1:5500",
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket Backend: a user connected");
    socket.on("newMessage", (message) => {
      io.emit("newMessage", message);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};
