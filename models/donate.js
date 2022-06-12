const mongoose = require('mongoose');

const donateSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: ['true', '捐贈者為必填'],
    },
    donatee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: ['true', '受贈人為必填'],
    },
    donateNum: {
      type: Number,
      required: ['true', '抖內金額為必填'],
      min: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

donateSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'donatee',
    select: '-following -followers -isValidator',
  });
  next();
});
const Donate = mongoose.model('Donate', donateSchema);

module.exports = Donate;
