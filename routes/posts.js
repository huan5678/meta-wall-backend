const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const postController = require('../controllers/post');
const { isAuthor } = require('../middleware/handleJWT');

//資料全撈
router.get('/', handleErrorAsync(postController.getAll));
router.get('/:id', handleErrorAsync(postController.getOne));
router.post('/create', isAuthor, handleErrorAsync(postController.postCreate));
router.delete('/:id', isAuthor, handleErrorAsync(postController.postDelete));
router.patch('/:id', isAuthor, handleErrorAsync(postController.postPatch));
router.post('/:id/likes', isAuthor, handleErrorAsync(postController.addLike));
router.delete('/:id/likes', isAuthor, handleErrorAsync(postController.deleteLike));
router.post('/:id/comment', isAuthor, handleErrorAsync(postController.addComment));
router.get('/user/:id', handleErrorAsync(postController.getUserPosts));

module.exports = router;
