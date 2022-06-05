const mongoose = require('mongoose');

const paymentSchema = {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'User ID 為必填資訊'],
    ref: 'User',
  },
  tradeNo: {
    type: String,
    required: [true, '交易編號為必填資訊'],
    unique: true,
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
    enum: ['CREDIT', 'VACC', 'WEBATM', 'BARCODE', 'CVS'],
    required: [true, '交易方式為必要資訊'],
  },
  payTime: {
    type: Date,
    required: [true, '支付完成時間為必要資訊'],
  },
  IP: {
    type: String,
    required: [true, 'IP 為必要資訊'],
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
