const express = require('express');
const router = express.Router();
const successHandle = require('../utils/successHandle');
const donateController = require('../controllers/donate');
const { decrypt } = require('../utils/newebpay');
const { isAuthor } = require('../middleware/handleJWT');

router.post('/', isAuthor, donateController.orderCreate);
router.post('/notify', (req, res, next) => {
  // console.log(decrypt(req.body.TradeInfo));
  successHandle(res, 'notify');
});
router.post('/callback', (req, res, next) => {
  const result = JSON.parse(decrypt(req.body.TradeInfo));
  successHandle(res, 'callback', result);
});

module.exports = router;
