const validator = require("validator");
const userModel = require("../models/userModel");
const { getUserIdFromRequest } = require("../utils/jwtUtils");

const getProfile = async (req, res) => {
  const userId = getUserIdFromRequest(req);

  try {
    const user = await userModel
      .findById(userId)
      .select(["_id", "userName", "nickname"]);
    return res.apiSuccess(user);
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

const getOtherUsers = async (req, res) => {
  const userId = getUserIdFromRequest(req);

  try {
    const users = await userModel
      .find({
        _id: { $nin: [userId] },
      })
      .select(["_id", "userName"]);
    return res.apiSuccess(users);
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

const validateNickname = async (req, res) => {
  const { newNickname } = req.params;

  try {
    console.log(newNickname);
    if (
      !validator.matches(
        newNickname,
        "^(?!\\s)[a-zA-Z0-9ㄱ-힣\\s]{0,29}[a-zA-Z0-9ㄱ-힣]$"
      )
    ) {
      return res.apiError(res.locals.messages.nicknameFormat);
    }
    return res.apiSuccess();
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

const updateNickname = async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { newNickname } = req.params;

  try {
    const updatedUser = await userModel.updateOne(
      { _id: userId },
      { $set: { nickname: newNickname } }
    );
    return res.apiSuccess(updatedUser);
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

module.exports = {
  getProfile,
  getOtherUsers,
  validateNickname,
  updateNickname,
};
