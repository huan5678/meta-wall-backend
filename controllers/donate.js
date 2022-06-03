const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');
const setTradeInfo = require('../utils/newebpay');
// const newebpay_MPG_url = 'https://ccore.newebpay.com/MPG/mpg_gateway';

const donateController = {
  orderCreate: handleErrorAsync(async (req, res, next) => {
    const result = setTradeInfo(50, 'TEST', 'chasel1020@gmail.com');
    successHandle(res, '成功取得交易資訊', result);
  }),
};

module.exports = donateController;
