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
    user.password = bcrypt.hash(user.password, salt);
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

const findUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId);
    return res.apiSuccess(user);
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    return res.apiSuccess(users);
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

module.exports = { registerUser, findUser, getUsers };
