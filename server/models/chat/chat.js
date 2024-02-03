import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  id: {
    type: Number,
  },
  value: {
    type: String,
  },
});

const ChatModel = mongoose.model("Chat", chatSchema);

const chats = [
  { id: 1, value: "Test1" },
  { id: 2, value: "Test2" },
  { id: 3, value: "Test3" },
];

chats.forEach((chat) => {
  ChatModel.create(chat)
    .then((createdChat) => {
      console.log("Chat created:", createdChat);
    })
    .catch((error) => {
      console.error("Error creating chat:", error);
    });
});

module.exports = { ChatModel };
