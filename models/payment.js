const mongoose = require('mongoose');

const paymentSchema = {};

const Payment_Schema = new mongoose.Schema(paymentSchema, {
  versionKey: false,
});

const Payment = mongoose.model('Payment', Payment_Schema);

module.exports = Payment;
