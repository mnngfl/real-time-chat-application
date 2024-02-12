const mongoose = require("mongoose");
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
  try {
    const chats = await chatModel.aggregate([
      {
        $match: {
          members: {
            $in: [new mongoose.Types.ObjectId(userId)],
          },
        },
      },
      {
        $lookup: {
          from: "users",
          let: {
            chatMembers: "$members",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$chatMembers"],
                },
              },
            },
          ],
          as: "joinedUsers",
        },
      },
      {
        $lookup: {
          from: "messages",
          let: {
            chatId: "$_id",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$chatId", "$$chatId"],
                },
              },
            },
            {
              $sort: { createdAt: -1 },
            },
            {
              $limit: 1,
            },
          ],
          as: "latestMessage",
        },
      },
      {
        $addFields: {
          latestMessage: {
            $arrayElemAt: ["$latestMessage", 0],
          },
        },
      },
      {
        $project: {
          _id: 0,
          chatId: "$_id",
          createdAt: 1,
          updatedAt: 1,
          joinedUsers: {
            $map: {
              input: "$joinedUsers",
              as: "user",
              in: {
                _id: "$$user._id",
                userName: "$$user.userName",
              },
            },
          },
          latestMessage: "$latestMessage.text",
        },
      },
    ]);
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
