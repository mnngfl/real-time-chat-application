const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: mongoose.Schema.Types.ObjectId,
    senderId: String,
    text: String,
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

module.exports = messageModel;
