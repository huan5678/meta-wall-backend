const Post = require('../models/post');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');

const postController = {
  postCreate: handleErrorAsync(async (req, res, next) => {
    let image;
    if(!req.body.image){
          image = '';
      }else{
        image = req.body.image;
      }

    const { content } = req.body;

    
    if (content == undefined) {
      return next(appError(400, '你沒有填寫 content 資料', next));
    }
    
    const newPost = await Post.create({
      userId: req.user._id,
      content,
      image
    });
    const returnPost =  {
      id:newPost.userId,
      content:newPost.content,
      image:newPost.image,
    }
    
    return successHandle(res, '成功新增一則貼文!!', returnPost);
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
