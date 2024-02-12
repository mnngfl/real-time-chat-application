const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    members: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;
