var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.send(
    `
    <a href="http://localhost:3000/user/google"><button type="button">google login</button></a>
    <a href="http://localhost:3000/user/facebook"><button type="button">FB login</button></a>
    <a href="http://localhost:3000/user/line"><button type="button">Line login</button></a>
    <a href="http://localhost:3000/user/discord"><button type="button">Discord login</button></a>
    `,
  );
});

module.exports = router;
