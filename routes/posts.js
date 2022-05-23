const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const successHandle = require('../utils/successHandle');
const postController = require('../controllers/post');
const { isAuthor } = require('../middleware/handleJWT');

//資料全撈
router.get('/', async (req, res) => {
  const post = await Post.find();
  successHandle(res, '成功撈取所有貼文', post);
});

router.post('/post/create', isAuthor, postController.postCreate);
router.delete('/post/delete/:id', isAuthor, postController.postDelete);

module.exports = router;
