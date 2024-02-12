const userModel = require("../models/userModel");

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

module.exports = { findUser, getUsers };
