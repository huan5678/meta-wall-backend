const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  const { token } = req.query;
  console.log(token);
  res.render('index', { title: 'Express' });
});

module.exports = router;
