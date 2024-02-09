const express = require("express");
const { testGet } = require("../controllers/chatController");

const router = express.Router();

router.get("/", testGet);

module.exports = router;
