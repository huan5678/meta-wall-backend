const Post = require('../models/post');
const Comment = require('../models/comments');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');

const postController = {
  getAll: async (req, res, next) => {
    let { timeSort, q, type = '', page = 0 } = req.query;
    const arr = ['likes', 'comments'];
    if (!arr.includes(type) && type) {
      return next(appError(400, '無此排序條件', next));
    }
    query = q !== undefined ? { content: new RegExp(req.query.q) } : {};
    const post = await Post.find(query)
      .populate({
        path: 'userId',
        select: 'name avatar',
      })
      .populate({
        path: 'comments',
        select: 'comment user createdAt',
      })
      .skip(page * 20);
    if (type) {
      post.sort((a, b) => {
        if (timeSort === 'asc') {
          return a[type].length - b[type].length;
        } else {
          return b[type].length - a[type].length;
        }
      });
    }
    successHandle(res, '成功撈取所有貼文', post);
  },
  getOne: async (req, res, next) => {
    const { id: _id } = req.params;
    if (!_id) {
      return next(appError(400, '無此貼文', next));
    }
    let getOneResult = await Post.findById({ _id })
      .populate({
        path: 'userId',
        select: 'name avatar',
      })
      .populate({
        path: 'comments',
        select: 'comment user createdAt',
      });
    return successHandle(res, '成功取得一則貼文', getOneResult);
  },
  postCreate: async (req, res, next) => {
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
  },
  postDelete: async (req, res, next) => {
    const id = req.params.id;
    if (!id) {
      return next(appError(400, '無此貼文', next));
    }
    let deleteResult = await Post.findByIdAndDelete({ _id: id });
    if (!deleteResult) {
      return next(appError(400, '刪除貼文失敗', next));
    }

    return successHandle(res, '刪除一則貼文');
  },
  postPatch: async (req, res, next) => {
    const { content = '', image = '' } = req.body;
    const { id } = req.params;
    if (!content) next(appError(400, '請檢查content 資料', next));

    const editPost = await Post.findByIdAndUpdate({ id }, { content, image, name }, { new: true });

    if (editPost === null || editPost === undefined) {
      next(appError(400, '請檢查content 資料', next));
    }

    successHandle(res, '成功編輯一則貼文!!', editPost);
  },
  addLike: async (req, res, next) => {
    const _id = req.params.id;
    await Post.findOneAndUpdate({ _id }, { $addToSet: { likes: req.user.id } });
    successHandle(res, '新增一個讚');
  },
  deleteLike: async (req, res, next) => {
    const _id = req.params.id;
    await Post.findOneAndUpdate({ _id }, { $pull: { likes: req.user.id } });
    successHandle(res, '刪除一個讚');
  },
  addComment: async (req, res, next) => {
    const {
      params: { id: post },
      user: { id: user },
      body: { comment: comment },
    } = req;
    const newComment = await Comment.create({
      post,
      user,
      comment,
    });

    await Comment.populate(newComment, {
      path: 'user',
      select: '_id -following -isValidator -followers',
    });

    successHandle(res, '成功新增一則留言', newComment);
  },
  getUserPosts: async (req, res, next) => {
    const userId = req.params.id;
    if (!userId) {
      next(appError(400, '尚未帶入 User ID', next));
    }
    const getPosts = await Post.find({ userId }).populate({
      path: 'comments',
      select: 'comment user',
    });
    if (!getPosts) {
      next(appError(400, '查無此 User', next));
    }
    successHandle(res, '成功取得單一會員所有貼文', getPosts);
  },
};
module.exports = postController;
