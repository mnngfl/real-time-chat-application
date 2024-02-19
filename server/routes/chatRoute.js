const express = require("express");
const {
  createChat,
  findUserChats,
  deleteNotifications,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.get("/", findUserChats);
router.delete("/notify/:chatId", deleteNotifications);

module.exports = router;
