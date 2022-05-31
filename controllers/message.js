const Message = require('../models/message');

const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');

const chatController = {
  getMessages: handleErrorAsync(async (req, res, next) => {
    return (messages = await Message.find());
  }),
  storeMessage: handleErrorAsync(async (req, res, next) => {
    const { content } = req.body;
    if (typeof content === undefined || content === null || content?.trim() === '') {
      return appError(400, '請正確填寫內容欄位，內容欄位不得為空', next);
    }

    const newMessage = await Message.create({
      userId: req.user._id,
      content: content,
    });
    const result = await Message.findById(newMessage._id);
    const returnMessage = {
      content: result.content,
      createdAt: result.createdAt,
      user: result.userId,
    };
    return successHandle(res, '成功送出聊天訊息', returnMessage);
  }),
};

module.exports = chatController;
