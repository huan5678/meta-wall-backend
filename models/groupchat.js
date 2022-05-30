const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, '使用者的 ID 為必要項目'],
      ref: 'User',
    },
  },
  { versionKey: false },
);
chatSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'name photo _id',
  });
  next();
});
const GroupChat = mongoose.model('group-chat', chatSchema);

module.exports = GroupChat;
