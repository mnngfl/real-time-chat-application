const chatModel = require("../models/chatModel");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) {
      return res.apiSuccess(chat);
    }

    const newChat = new chatModel({
      members: [firstId, secondId],
    });
    const response = await newChat.save();
    return res.apiSuccess(response, "Chat created", 201);
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

const findUserChats = async (req, res) => {
  const { userId } = req.params;
  console.log("userId:", userId);
  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });
    console.dir(chats);
    res.apiSuccess(chats);
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    res.apiSuccess(chat);
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

module.exports = { createChat, findUserChats, findChat };
