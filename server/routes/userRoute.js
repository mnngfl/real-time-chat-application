const express = require("express");
const { findUser, getOtherUsers } = require("../controllers/userController");

const router = express.Router();

router.get("/find/:userId", findUser);
router.get("/others", getOtherUsers);

module.exports = router;
