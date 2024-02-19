const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  chatId: mongoose.Schema.Types.ObjectId,
  unreadCount: Number,
});

const notificationModel = mongoose.model("Notification", notificationSchema);

module.exports = notificationModel;
