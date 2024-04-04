const express = require("express");
const {
  registerUser,
  refreshToken,
  loginUser,
  checkAvailableUserName,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.get("/check-id/:userName", checkAvailableUserName);
router.post("/login", loginUser);
router.post("/refresh-token", refreshToken);

module.exports = router;
