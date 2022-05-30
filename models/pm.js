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
    currentUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, '使用者自身的 ID 為必要項目'],
      ref: 'User',
    },
    targetUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, '對象使用者的 ID 為必要項目'],
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
const PM = mongoose.model('Chat', chatSchema);

module.exports = PM;
