const mongoose = require("mongoose");
const messageModel = require("../models/messageModel");
const { getUserIdFromRequest } = require("../utils/jwtUtils");

const createMessage = async (req, res) => {
  const { chatId, text } = req.body;
  const userId = getUserIdFromRequest(req);

  const message = new messageModel({
    chatId,
    senderId: userId,
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
    const messages = await messageModel.aggregate([
      {
        $match: {
          chatId: {
            $eq: new mongoose.Types.ObjectId(chatId),
          },
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            senderId: "$senderId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$senderId"],
                },
              },
            },
          ],
          as: "sender",
        },
      },
      {
        $addFields: {
          sendUser: {
            $arrayElemAt: ["$sender", 0],
          },
        },
      },
      {
        $project: {
          _id: 1,
          chatId: 1,
          createdAt: 1,
          updatedAt: 1,
          text: 1,
          sendUser: {
            _id: "$sendUser._id",
            userName: "$sendUser.userName",
          },
        },
      },
    ]);
    res.apiSuccess(messages);
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

module.exports = { createMessage, getMessages };
