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
  const { page, limit } = req.query;
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 20;

  try {
    const messages = await messageModel
      .aggregate([
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
          $sort: {
            createdAt: -1,
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
            totalItems: 1,
            sendUser: {
              _id: "$sendUser._id",
              userName: "$sendUser.userName",
            },
          },
        },
      ])
      .facet({
        totalItems: [
          { $group: { _id: null, count: { $sum: 1 } } },
          { $project: { _id: 0 } },
        ],
        data: [{ $skip: (pageNum - 1) * limitNum }, { $limit: limitNum * 1 }],
      })
      .exec();

    const totalItems = messages[0] ? messages[0].totalItems[0].count : 0;
    const totalPage = Math.ceil(totalItems / limitNum);
    const hasMorePages = pageNum < totalPage;

    const pageInfo = {
      page: pageNum,
      limit: limitNum,
      totalItems,
      totalPage,
      hasMorePages,
    };

    res.apiSuccessPagination(messages[0].data.reverse(), pageInfo);
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};

module.exports = { createMessages, getMessages };
