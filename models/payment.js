const mongoose = require('mongoose');

const paymentSchema = {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID 為必填資訊'],
    ref: 'User',
  },
  tradeNo: {
    type: String,
    default: '',
  },
  merchantOrderNo: {
    type: String,
    required: [true, '訂單編號為必填資訊'],
    unique: true,
  },
  amt: {
    type: Number,
    required: [true, '金額為必要資訊'],
  },
  paymentType: {
    type: String,
    enum: ['CREDIT', 'VACC', 'WEBATM', 'BARCODE', 'CVS', ''],
    default: '',
  },
  payTime: {
    type: Number,
    default: 0,
  },
  IP: {
    type: String,
    default: '',
  },
  payment_status: {
    // 這邊定義帳單狀態 0: 尚未繳費 1: 已繳費 2: 過期
    type: Number,
    default: 0,
  },
};

const Payment_Schema = new mongoose.Schema(paymentSchema, {
  versionKey: false,
});

Payment_Schema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'name photo _id',
  });
  next();
});

const Payment = mongoose.model('Payment', Payment_Schema);

module.exports = Payment;
