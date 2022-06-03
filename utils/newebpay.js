const crypto = require('crypto');
const newebpay_merchant_id = process.env.NEWEBPAY_MERCHANT_ID;
const newebpay_hash_key = process.env.NEWEBPAY_HASH_KEY;
const newebpay_hash_iv = process.env.NEWEBPAY_HASH_IV;
const newebpay_return_url = 'https://meta-wall-backend.herokuapp.com/donate/callback';
const newebpay_notify_url = 'https://meta-wall-backend.herokuapp.com/donate/notify';
const newebpay_MPG_url = 'https://ccore.newebpay.com/MPG/mpg_gateway';

const paramsToString = (params) => {
  return Object.keys(params)
    .map((key) => key + '=' + params[key])
    .join('&');
};

const encrypt = (data) => {
  let encrypt = crypto.createCipheriv('aes256', newebpay_hash_key, newebpay_hash_iv);
  let enc = encrypt.update(paramsToString(data), 'utf8', 'hex');
  return enc + encrypt.final('hex');
};

const decrypt = (tradeInfo) => {
  let decrypt = crypto.createDecipheriv('aes256', newebpay_hash_key, newebpay_hash_iv);
  decrypt.setAutoPadding(false);
  let result = decrypt.update(tradeInfo, 'hex', 'utf8');
  return (result += decrypt.final('utf8'));
};

const shaHash = (encrypt) => {
  return crypto
    .createHash('sha256')
    .update(`HashKey=${newebpay_hash_key}&${encrypt}&HashIV=${newebpay_hash_iv}`)
    .digest('hex')
    .toUpperCase();
};

const setTradeInfo = (amt, desc, email) => {
  const params = {
    MerchantID: newebpay_merchant_id,
    RespondType: 'JSON',
    TimeStamp: Date.now,
    Version: '2.0',
    MerchantOrderNo: Date.now,
    ItemDesc: desc,
    Amt: amt,
    Email: email,
    LoginType: 0,
  };

  const tradeInfo = encrypt(params);
  const tradeInfoSha = shaHash(tradeInfo);

  return {
    MerchantID: newebpay_merchant_id,
    TradeInfo: tradeInfo,
    TradeSha: tradeInfoSha,
    Version: '2.0',
  };
};

module.exports = setTradeInfo;
