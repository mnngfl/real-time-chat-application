const express = require("express");
const { refreshToken, loginUser } = require("../controllers/authController");

const router = express.Router();

router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);

module.exports = router;
