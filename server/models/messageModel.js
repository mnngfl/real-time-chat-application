const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: mongoose.Schema.Types.ObjectId,
    senderId: mongoose.Schema.Types.ObjectId,
    text: String,
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
