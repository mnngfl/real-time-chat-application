const express = require("express");
const {
  createChat,
  deleteNotifications,
  searchUserChats,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.get("/", searchUserChats);
router.delete("/notify/:chatId", deleteNotifications);

module.exports = router;
