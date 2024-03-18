const express = require("express");
const {
  getProfile,
  getOtherUsers,
  validateNickname,
  updateNickname,
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", getProfile);
router.get("/others", getOtherUsers);
router.get("/validate/:newNickname", validateNickname);
router.put("/update-name/:newNickname", updateNickname);

module.exports = router;
