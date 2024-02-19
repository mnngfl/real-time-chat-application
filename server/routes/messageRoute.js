const express = require("express");
const {
  createMessages,
  getMessages,
} = require("../controllers/messageController");

const router = express.Router();

router.post("/multiple", createMessages);
router.get("/:chatId", getMessages);

module.exports = router;
