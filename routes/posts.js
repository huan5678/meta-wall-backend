const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const successHandle = require('../utils/successHandle');
const postController = require('../controllers/post');
const isAuth = require('../middleware/handleJWT');

//資料全撈
router.get('/', async (req, res) => {
  const post = await Post.find();
  successHandle(res, '成功撈取所有貼文', post);
});

router.post('/post/create', isAuth, postController.postCreate);
router.delete('/post/delete/:id', isAuth, postController.postDelete);

module.exports = router;
