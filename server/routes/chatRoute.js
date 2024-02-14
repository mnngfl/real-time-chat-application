const express = require("express");
const {
  createChat,
  findUserChats,
  findChat,
} = require("../controllers/chatController");

const router = express.Router();

router.post("/", createChat);
router.get("/", findUserChats);
router.get("/:chatId", findChat);

module.exports = router;
