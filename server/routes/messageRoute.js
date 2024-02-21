const express = require("express");
const {
  createMessages,
  getMessages,
  createNotifications,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/multiple", createMessages);
router.post("/notifications", createNotifications);
router.get("/:chatId", getMessages);

module.exports = router;
