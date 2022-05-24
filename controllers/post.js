const Post = require('../models/post');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');

const postController = {
  getOne: handleErrorAsync(async (req, res, next) => {
    const _id = req.params.id;
    if (!_id) {
      return next(appError(400, '無此貼文', next));
    }
    let getOneResult = await Post.findById({ _id });
    return successHandle(res, '成功取得一則貼文', getOneResult);
  }),
  postCreate: handleErrorAsync(async (req, res, next) => {
    const { content } = req.body;
    if (content == undefined) {
      return next(appError(400, '你沒有填寫 content 資料', next));
    }
    const newPost = await Post.create({
      name: req.user.name,
      content,
    });
    return successHandle(res, '成功新增一則貼文!!', newPost);
  }),
  postDelete: handleErrorAsync(async (req, res, next) => {
    const _id = req.params.id;
    if (!_id) {
      return next(appError(400, '無此貼文', next));
    }
    let deleteResult = await Post.findByIdAndDelete({ id: _id });
    return successHandle(res, '刪除一則貼文', deleteResult);
  }),
};

module.exports = postController;
