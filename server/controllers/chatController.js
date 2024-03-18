const mongoose = require("mongoose");
const chatModel = require("../models/chatModel");
const notificationModel = require("../models/notificationModel");
const { getUserIdFromRequest } = require("../utils/jwtUtils");

const createChat = async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { recipientId } = req.body;

  try {
    const chat = await chatModel.findOne({
      members: { $all: [userId, recipientId] },
    });
    if (chat) {
      return res.apiSuccess(chat);
    }

    const newChat = new chatModel({
      members: [userId, recipientId],
    });
    const response = await newChat.save();
    return res.apiSuccess(response, "Chat created", 201);
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

const findUserChats = async (req, res) => {
  const userId = getUserIdFromRequest(req);
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
        $lookup: {
          from: "notifications",
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
              $group: {
                _id: ["$chatId", "$userId"],
                unreadCount: { $sum: "$unreadCount" },
              },
            },
          ],
          as: "notifications",
        },
      },
      {
        $addFields: {
          latestMessage: {
            $arrayElemAt: ["$latestMessage", 0],
          },
          unreadCount: 0,
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
                nickname: "$$user.nickname",
              },
            },
          },
          latestMessage: "$latestMessage.text",
          latestMessageAt: "$latestMessage.createdAt",
          notifications: 1,
        },
      },
    ]);
    res.apiSuccess(chats);
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

const deleteNotifications = async (req, res) => {
  const userId = getUserIdFromRequest(req);
  const { chatId } = req.params;
  try {
    const result = await notificationModel.deleteMany({
      chatId: chatId,
      userId: userId,
    });
    return res.apiSuccess(result.deletedCount);
  } catch (error) {
    console.error(error);
    return res.apiError(error);
  }
};

module.exports = { createChat, findUserChats, deleteNotifications };
