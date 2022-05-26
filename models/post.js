// 資料庫設定開始
const mongoose = require('mongoose');
//定義table欄位型態
const postSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
    },
    image: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, '貼文ID必須'],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  { versionKey: false },
);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
