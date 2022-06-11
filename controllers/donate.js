const Payment = require('../models/payment');
const User = require('../models/user');
const Donate = require('../models/donate');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');
const eventController = require('../controllers/sse');
const { setTradeInfo } = require('../utils/newebpay');
const { decrypt } = require('../utils/newebpay');

const donateController = {
  orderCreate: async (req, res, next) => {
    const { _id: id } = req.user;
    const { email, amt, desc } = req.body;
    const result = setTradeInfo(amt, desc, email, id);

    if (!id) {
      return appError(400, '會員驗證錯誤', next);
    }

    if (!email || !amt || !desc) {
      return appError(400, '必填欄位尚未填寫', next);
    }

    const mongooseResult = await Payment.create({
      userId: id,
      merchantOrderNo: result.mongoose.merchantOrderNo,
      amt,
    });

    successHandle(res, '成功取得交易資訊', result.newsbpay);
  },
  orderNotify: async (req, res, next) => {
    const id = req.query.id;
    const result = JSON.parse(decrypt(req.body.TradeInfo));
    const amtToCoin = {
      100: 35,
      900: 320,
      1490: 1290,
    };
    if (result.Status === 'SUCCESS') {
      let { TradeNo, MerchantOrderNo, PaymentType, PayTime, IP, Amt } = result.Result;
      PayTime = new Date(PayTime.substring(0, 10) + 'T' + PayTime.substring(10, 18)).getTime();

      const updateResult = await Payment.findOneAndUpdate(
        { merchantOrderNo: MerchantOrderNo },
        { payment_status: 1, tradeNo: TradeNo, paymentType: PaymentType, payTime: PayTime, IP },
        { new: true },
      );

      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: { coin: amtToCoin[Amt] },
        },
      );

      if (updateResult) {
        req.order = { id, no: MerchantOrderNo };
        eventController.pushEvents(req, res, next);
      }
    }
    res.end();
  },
  orderCallback: async (req, res, next) => {
    res.send(
      `
        <script type='text/javascript'>
          window.close();
        </script>
      `,
    );
  },
  donateUser: async (req, res, next) => {
    const donateUserID = req.user.id;
    const { id: donateeID } = req.params;
    const { coinNum } = req.body;

    await User.updateOne(
      {
        _id: donateUserID,
      },
      {
        $inc: { coin: -coinNum },
      },
    );

    await User.updateOne(
      {
        _id: donateeID,
      },
      {
        $inc: { coin: coinNum },
      },
    );

    await Donate.create({
      userId: donateUserID,
      donatee: donateeID,
      donateNum: coinNum,
    });

    res.status(200).json({
      status: 'success',
      message: '您已成功抖內！',
    });
  },
  getOrderList: async (req, res, next) => {
    const id = req.user.id;
    const orderList = await Payment.find({ userId: id }).select('-userId -merchantOrderNo');

    return successHandle(res, '成功取得帳單列表', orderList);
  },
  getDonateList: async (req, res, next) => {
    const id = req.user.id;
    const donateList = await Donate.find({ userId: id });
    return successHandle(res, '成功取得贊助列表', donateList);
  },
};

module.exports = donateController;
