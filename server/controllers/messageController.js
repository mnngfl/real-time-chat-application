const mongoose = require("mongoose");
const messageModel = require("../models/messageModel");
const notificationModel = require("../models/notificationModel");

const createMessages = async (req, res) => {
  const messages = req.body;

  try {
    const messageModels = messages.map((message) => {
      return new messageModel({
        chatId: message.chatId,
        senderId: message.sendUser._id,
        text: message.text,
        createdAt: message.createdAt,
        updatedAt: message.updatedAt,
      });
    });
    const response = await messageModel.insertMany(messageModels);

    const notiMap = new Map();
    messages.forEach(({ chatId, receiveUser }) => {
      const key = `${chatId}-${receiveUser._id}`;
      notiMap.set(key, (notiMap.get(key) || 0) + 1);
    });
    const notiArr = Array.from(notiMap.entries()).map(([key, unreadCount]) => {
      const [chatId, userId] = key.split("-");
      return new notificationModel({ chatId, userId, unreadCount });
    });
    await notificationModel.insertMany(notiArr);

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
        $lookup: {
          from: "users",
          let: {
            receiverId: "$receiverId",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$_id", "$$receiverId"],
                },
              },
            },
          ],
          as: "receiver",
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $addFields: {
          sendUser: {
            $arrayElemAt: ["$sender", 0],
          },
          receiveUser: {
            $arrayElemAt: ["$receiver", 0],
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
          receiveUser: {
            _id: "$receiveUser._id",
            userName: "$receiveUser.userName",
          },
          sendUser: "$sendUser",
          receiveUser: "$receiveUser",
        },
      },
    ]);
    res.apiSuccess(messages);
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

module.exports = { createMessages, getMessages };
