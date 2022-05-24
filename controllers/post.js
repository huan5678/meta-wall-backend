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
    const { content, image = '' } = req.body;

    if (content == undefined) {
      return next(appError(400, '你沒有填寫 content 資料', next));
    }

    const newPost = await Post.create({
      userId: req.user._id,
      content,
      image,
    });
    const returnPost = {
      id: newPost.userId,
      content: newPost.content,
      image: newPost.image,
    };

    return successHandle(res, '成功新增一則貼文!!', returnPost);
  }),
  postDelete: handleErrorAsync(async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
      return next(appError(400, '無此貼文', next));
    }
    let deleteResult = await Post.findByIdAndDelete({ _id: id });
    if (!deleteResult) {
      return next(appError(400, '刪除貼文失敗', next));
    }

    return successHandle(res, '刪除一則貼文');
  }),
  addLike: handleErrorAsync(async (req, res, next) => {
    const _id = req.params.id;
    await Post.findOneAndUpdate({ _id }, { $addToSet: { likes: req.user.id } });
    successHandle(res, '新增一個讚', { postId: _id, useId: req.user.id });
  }),
  deleteLike: handleErrorAsync(async (req, res, next) => {
    const _id = req.params.id;
    await Post.findOneAndUpdate({ _id }, { $pull: { likes: req.user.id } });
    successHandle(res, '刪除一個讚', { postId: _id, useId: req.user.id });
  }),
};

module.exports = postController;
