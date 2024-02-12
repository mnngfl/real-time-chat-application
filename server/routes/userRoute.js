const express = require("express");
const { findUser, getUsers } = require("../controllers/userController");

const router = express.Router();

router.get("/find/:userId", findUser);
router.get("/", getUsers);

module.exports = router;
