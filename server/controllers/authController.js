const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcrypt");
const validator = require("validator");
const userModel = require("../models/userModel");

const registerUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    if (!validator.matches(userName, "([a-z0-9]){4,30}")) {
      return res.apiError(
        "UserName must be 4 to 30 lowercase letters and numbers...",
        400
      );
    }
    if (!userName || !password) {
      return res.apiError("All fields are required...", 400);
    }
    if (
      !validator.isStrongPassword(password, {
        minUppercase: 0,
      })
    ) {
      return res.apiError("Password must be a strong passwords...", 400);
    }
    let user = await userModel.findOne({ userName });
    if (user) {
      return res.apiError("User with the given userName already exist...", 400);
    }

    user = new userModel({ userName, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    return res.apiSuccess(
      { _id: user._id, userName },
      "User registered successfully.",
      201
    );
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  try {
    let user = await userModel.findOne({ userName });
    if (!user) {
      return res.apiError("Invalid email or password...", 400);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.apiError("Invalid email or password...", 400);
    }

    const accessToken = jwtUtils.generateAccessToken(user._id);
    const refreshToken = jwtUtils.generateRefreshToken(user._id);

    return res.apiSuccess({
      _id: user._id,
      userName,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

const refreshToken = (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(refreshToken, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);

    const accessToken = jwtUtils.generateAccessToken(user._id);
    res.json({ accessToken });
  });
};

module.exports = { registerUser, loginUser, refreshToken };
