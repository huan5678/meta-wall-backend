const GroupChat = require('../models/groupchat');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');
const websocketServer = require('../services/websocket');

const chatController = {
  sendGroupChat: handleErrorAsync(async (req, res, next) => {
    const { content } = req.body;
    if (typeof content === undefined || content === null || content?.trim() === '') {
      return appError(400, '請正確填寫內容欄位，內容欄位不得為空', next);
    }

    const newChat = await GroupChat.create({
      userId: req.user._id,
      content,
    });
    const returnChat = {
      id: newChat.userId,
      content: newChat.content,
      createdAt: newChat.createdAt,
      user: newChat.userId,
    };
    return websocketServer.send(returnChat);
    // return successHandle(res, '成功送出聊天訊息!!', returnChat);
  }),
};

module.exports = chatController;
