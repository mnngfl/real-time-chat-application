const { Server } = require("socket.io");
const axios = require("axios");

const io = new Server({
  cors: {
    origin: ["http://localhost:5173"],
  },
});

const instance = axios.create({
  baseURL: "http://server:3000/api",
  timeout: 1000,
  headers: {
    "Content-Type": "application/json",
  },
});

let onlineUsers = [];
let messagesById = {};
let selectedRoomById = {};

const createMessages = async (messages) => {
  return await instance.post("/messages2/multiple", messages);
};

const createNotifications = async (messages) => {
  return await instance.post("/messages2/notifications", messages);
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

  socket.on("changeRoom", (chatId) => {
    selectedRoomById[socket.id] = chatId;
    console.log("Change Room: ", selectedRoomById);
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

    messagesToSave.forEach((key) => (messagesById[key].isSaving = true));
    const req = messagesToSave.flatMap((key) => messagesById[key].data);
    try {
      const res = await createMessages(req);

      const notiReq = req.filter((item) => {
        return (
          Object.values(selectedRoomById).filter(
            (roomId) => roomId === item.chatId
          ).length <= 1
        );
      });
      const notiRes = await createNotifications(notiReq);

      messagesToSave.forEach((key) => {
        delete messagesById[key];
      });

      const notifyTarget = notiReq.map((v) => v.chatId);
      socket.to(notifyTarget).emit("getNotification");
    } catch (error) {
      console.error(error);
    }
  }, 10000);

  socket.on("logout", (userId) => {
    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    io.emit("getOnlineUsers", onlineUsers);
  });

  socket.on("disconnect", async () => {
    delete selectedRoomById[socket.id];
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
      const req = messagesById[socket.id].data;
      const res = await createMessages(req);

      const notiReq = req.filter((item) => {
        return (
          Object.values(selectedRoomById).filter(
            (roomId) => roomId === item.chatId
          ).length <= 1
        );
      });
      const notiRes = await createNotifications(notiReq);

      delete messagesById[socket.id];

      const notifyTarget = notiReq.map((v) => v.chatId);
      socket.to(notifyTarget).emit("getNotification");
    } catch (error) {
      console.error(error);
    }
  });
});

io.listen(3030);
