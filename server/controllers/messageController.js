const messageModel = require("../models/messageModel");

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new messageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const response = await message.save();
    res.apiSuccess(response, "Message created", 201);
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    res.apiSuccess(messages);
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

module.exports = { createMessage, getMessages };
