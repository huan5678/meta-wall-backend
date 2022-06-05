const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');
const { setTradeInfo } = require('../utils/newebpay');
// const newebpay_MPG_url = 'https://ccore.newebpay.com/MPG/mpg_gateway';

const donateController = {
  orderCreate: handleErrorAsync(async (req, res, next) => {
    const { email, amt, desc } = req.body;
    const result = setTradeInfo(amt, desc, email);
    successHandle(res, '成功取得交易資訊', result);
  }),
};

module.exports = donateController;
