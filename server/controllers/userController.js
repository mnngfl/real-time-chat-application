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
  try {
    const { userName, password } = req.body;

    let user = await userModel.findOne({ userName });

    if (user)
      return res
        .status(400)
        .json("User with the given userName already exist...");
    if (!userName || !password)
      return res.status(400).json("All fields are required...");
    if (!validator.isStrongPassword(password))
      return res.status(400).json("Password must be a strong passwords...");

    user = new userModel({ userName, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, userName, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { registerUser };
