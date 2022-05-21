const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const successHandle = require('../utils/successHandle');
//資料全撈
router.get('/', async (req, res) => {
  const post = await Post.find();
  successHandle(res, '全部貼文', post);
});
module.exports = router;
