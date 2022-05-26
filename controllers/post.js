const Post = require('../models/post');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');

const postController = {
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
    const id = req.params.id;
    if (!id) {
      return next(appError(400, '無此貼文', next));
    }
    let deleteResult = await Post.findByIdAndDelete({ _id: id});
    console.log(deleteResult);
    return successHandle(res, '刪除一則貼文', deleteResult);
  }),
};

module.exports = postController;
