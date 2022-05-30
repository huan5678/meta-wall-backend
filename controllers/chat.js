const GroupChat = require('../models/groupchat');

const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');

const chatController = {
  sendChat: handleErrorAsync(async (req, res, next) => {
    const { content } = req.body;
    if (typeof content === undefined || content === null || content?.trim() === '') {
      return appError(400, '請正確填寫內容欄位，內容欄位不得為空', next);
    }

    const newChat = await GroupChat.create({
      userId: req.user._id,
      content: content,
    });
    const result = await GroupChat.findById(newChat._id);
    const returnChat = {
      content: result.content,
      createdAt: result.createdAt,
      user: result.userId,
    };
    return successHandle(res, '成功送出聊天訊息', returnChat);
  }),
};

async function preloadChat(ws, message) {
  const chatHistory = await GroupChat.find();
  const resChat = JSON.stringify({ Chats: chatHistory });
  if (message) {
    return ws.send(message);
  }
  return ws.send(resChat);
}

module.exports = { preloadChat, chatController };
