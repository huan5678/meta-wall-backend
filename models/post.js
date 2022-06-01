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
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, '貼文者的ID為必要項目'],
      ref: 'User',
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      default: [],
    },
  },
  { versionKey: false },
);
postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'name avatar _id',
  });
  next();
});
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
