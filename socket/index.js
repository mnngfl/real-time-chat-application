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
    const users = onlineUsers
      .filter(
        (user) =>
          user.userId === message.sendUser._id ||
          user.userId === message.receiveUser._id
      )
      .map((v) => v.socketId);

    if (users.length > 0) {
      io.to(users).emit("getMessage", message);
      io.to(users).emit("getNotification", {
        chatId: message.chatId,
        sendUser: {
          _id: message.sendUser._id,
          userName: message.sendUser.userName,
        },
        receiveUser: {
          _id: message.receiveUser._id,
          userName: message.receiveUser.userName,
        },
        latestMessage: message.text,
        latestMessageAt: new Date(),
      });
    }
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);

    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(3030);
