const express = require('express');
const router = express.Router();
const successHandle = require('../utils/successHandle');
const donateController = require('../controllers/donate');
const { isAuthor } = require('../middleware/handleJWT');

router.get('/', isAuthor, donateController.orderCreate);
router.post('/notify', (res, req, next) => {
  console.log('notify');
  console.log(res);
  console.log(req);
  successHandle(res, 'notify', { res, req });
});
router.post('/callback', (res, req, next) => {
  console.log('callback');
  console.log(res);
  console.log(req);
  successHandle(res, 'callback', { res, req });
});

module.exports = router;
