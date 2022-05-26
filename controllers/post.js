const Post = require('../models/post');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');

const postController = {
  getAll: handleErrorAsync(async (req, res, next) => {
    const post = await Post.find();
    successHandle(res, '成功撈取所有貼文', post);
  }),
  getOne: handleErrorAsync(async (req, res, next) => {
    const { id: _id } = req.params;
    if (!_id) {
      return next(appError(400, '無此貼文', next));
    }
    let getOneResult = await Post.findById({ _id }, { _id: 0 });
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
  postPatch: handleErrorAsync(async (req, res, next) => {
    const { body } = req;
    const { id } = req.params;
    const editPost = await Post.findByIdAndUpdate(id, body);
    if (body.content && editPost) {
      console.log(editPost);
      const editda = await Post.findById(editPost._id);
      successHandle(res, '成功編輯一則貼文!!', editda);
    }
    return next(appError(400, '請檢查content 資料', next));
  }),
};
module.exports = postController;
