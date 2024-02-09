const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET_KEY;
const jwtUtils = require("../utils/jwtUtils");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

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
    const currentTime = new Date();
    const expiresIn = Math.floor(
      new Date(currentTime.getTime() + 1 * 60 * 1000).getTime() / 1000
    ); // 1m

    return res.apiSuccess({
      _id: user._id,
      userName,
      accessToken,
      refreshToken,
      expiresIn,
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

module.exports = { loginUser, refreshToken };
