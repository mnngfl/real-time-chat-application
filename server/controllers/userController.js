const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const userModel = require("../models/userModel");

const createToken = (_id) => {
  const jwtKey = process.env.JWT_SECRET_KEY;
  return jwt.sign(
    {
      _id,
    },
    jwtKey,
    { expiresIn: "1d" }
  );
};

const registerUser = async (req, res) => {
  const { userName, password } = req.body;
  try {
    let user = await userModel.findOne({ userName });

    if (user) {
      return res.apiError("User with the given userName already exist...", 400);
    }
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

    user = new userModel({ userName, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    return res.apiSuccess({ _id: user._id, userName, token });
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

    const token = createToken(user._id);

    return res.apiSuccess({ _id: user._id, userName, token });
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

module.exports = { registerUser, loginUser, findUser, getUsers };
