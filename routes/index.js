var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(
    `
    <a href="http://localhost:3000/user/google"><button type="button">google login</button></a>
    <a href="http://localhost:3000/user/facebook"><button type="button">FB login</button></a>
    <a href="http://localhost:3000/user/line"><button type="button">Line login</button></a>
    <form method=post action="https://ccore.newebpay.com/MPG/mpg_gateway">
      MID: <input name="MerchantID" value="MS136887520" readonly><br>
      Version: <input name="Version" value="2.0" readonly><br>
      TradeInfo:
      <input name="TradeInfo" value="c3a500466eec3229eaf240a55198cfd80dd0d38336d5b098702ad9c5c51f7f51b1c0b9a23b3ee24fe8bcb033d193579005a102af77f724f5b13e3558f30949e0710f74ef78c3cad0430e14f0b02b62eb23af43d8ecb23ce48ec77aabe05761842e040da956500d71af3382a2f92ed99a6611a92faad78e0625aa1707d186b07513c25a1ba123175d005079b2f6151124939b0f1bc544b59dcbee64006d874d707f4dcf0fc83e863f5b42afb5fcd220b2" readonly><br>
      TradeSha:
      <input name="TradeSha" value="5F92674B1A19E9783A63513A2F68448C075DC46EEF5DF01AB970524BA90C9E90" readonly><br>
      <input type=submit value='Submit'>
    </form>
    `,
  );
});

module.exports = router;
