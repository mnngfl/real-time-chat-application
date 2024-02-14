const userModel = require("../models/userModel");
const { getUserIdFromRequest } = require("../utils/jwtUtils");

const findUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await userModel.findById(userId).select(["_id", "userName"]);
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

module.exports = { findUser, getOtherUsers };
