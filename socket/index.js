const { Server } = require("socket.io");
const axios = require("axios");

const io = new Server({
  cors: "http://localhost:5173",
});

let onlineUsers = [];
let messagesById = {};

const createMessages = async (messages) => {
  return await axios.post(
    "http://localhost:3000/api/messages2/multiple",
    messages
  );
};

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

  socket.on("enterRoom", (roomNames) => {
    socket.join(roomNames);
    console.log("Room: ", socket.rooms);
  });

  socket.on("sendMessage", (message) => {
    if (!messagesById[socket.id]) {
      messagesById[socket.id] = {
        isSaving: false,
        data: [],
      };
    }
    messagesById[socket.id].data.push(message);

    io.to(message.chatId).emit("getMessage", message);
  });

  const saveToDatabaseInterval = setInterval(async () => {
    const messagesToSave = Object.keys(messagesById).filter((key) => {
      return messagesById[key].isSaving !== true;
    });
    if (messagesToSave.length === 0) return;

    const req = messagesToSave.flatMap((key) => {
      messagesById[key].isSaving = true;
      return messagesById[key].data;
    });
    const res = await createMessages(req);

    messagesToSave.forEach((key) => {
      delete messagesById[key];
    });

    const notifyTarget = res.data.data.map((v) => v.chatId);
    socket.to(notifyTarget).emit("getNotification");
  }, 10000);

  socket.on("logout", (userId) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("disconnect", async () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);

    clearInterval(saveToDatabaseInterval);
    if (
      !messagesById[socket.id] ||
      messagesById[socket.id]?.data?.length === 0 ||
      messagesById[socket.id]?.isSaving === true
    ) {
      return;
    }

    try {
      messagesById[socket.id].isSaving = true;
      const res = await createMessages(messagesById[socket.id].data);
      delete messagesById[socket.id];

      const notifyTarget = res.data.data.map((v) => v.chatId);
      socket.to(notifyTarget).emit("getNotification");
    } catch (error) {
      console.error(error);
    }
  });
});

io.listen(3030);
