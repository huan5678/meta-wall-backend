const Payment = require('../models/payment');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');
const eventController = require('../controllers/sse');
const { setTradeInfo } = require('../utils/newebpay');
const { decrypt } = require('../utils/newebpay');

const donateController = {
  orderCreate: handleErrorAsync(async (req, res, next) => {
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
  }),
  orderNotify: handleErrorAsync(async (req, res, next) => {
    const id = req.query.id;
    const result = JSON.parse(decrypt(req.body.TradeInfo));
    if (result.Status === 'SUCCESS') {
      let { TradeNo, MerchantOrderNo, PaymentType, PayTime, IP } = result.Result;
      PayTime = new Date(PayTime.substring(0, 10) + 'T' + PayTime.substring(10, 18)).getTime();

      const updateResult = await Payment.findOneAndUpdate(
        { merchantOrderNo: MerchantOrderNo },
        { payment_status: 1, tradeNo: TradeNo, paymentType: PaymentType, payTime: PayTime, IP },
        { new: true },
      );

      if (updateResult) {
        req.order = { id, no: MerchantOrderNo };
        eventController.pushEvents(req, res, next);
      }
    }
    res.end();
  }),
  orderCallback: handleErrorAsync(async (req, res, next) => {
    res.send(
      `
        <script type='text/javascript'>
          window.close();
        </script>
      `,
    );
  }),
};

module.exports = donateController;
