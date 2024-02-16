const { Server } = require("socket.io");

const io = new Server({
  cors: "http;/localhost:5173",
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("new connection: ", socket.id);

  socket.on("addNewUser", (userId) => {
    if (onlineUsers.some((user) => user.userId === userId)) return;

    onlineUsers.push({
      userId,
      socketId: socket.id,
    });
    console.log("onlineUsers", onlineUsers);

    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("sendMessage", (message) => {
    console.log(message);
    const users = onlineUsers.filter(
      (user) =>
        user.userId === message.sendUserId ||
        user.userId === message.receiveUser._id
    );

    if (users) {
      io.to(users).emit("getMessage", message);
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3030);
