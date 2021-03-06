const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const postController = require('../controllers/post');
const { isAuthor } = require('../middleware/handleJWT');

//資料全撈
router.get('/', isAuthor, handleErrorAsync(postController.getAll));
router.get('/:id', isAuthor, handleErrorAsync(postController.getOne));
router.post('/create', isAuthor, handleErrorAsync(postController.postCreate));
router.delete('/:id', isAuthor, handleErrorAsync(postController.postDelete));
router.patch('/:id', isAuthor, handleErrorAsync(postController.postPatch));
router.post('/:id/likes', isAuthor, handleErrorAsync(postController.addLike));
router.delete('/:id/likes', isAuthor, handleErrorAsync(postController.deleteLike));
router.post('/:id/comment', isAuthor, handleErrorAsync(postController.addComment));
router.get('/user/:id', handleErrorAsync(postController.getUserPosts));

module.exports = router;

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /posts:
 *   get:
 *     tags:
 *       - Post 貼文
 *     summary: 取得所有貼文
 *     security:
 *       - bearerAuth: []
 *     description: 取得所有貼文
 *     parameters:
 *       - in: query
 *         name: timeSort
 *         schema:
 *           type: string
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 取得所有貼文
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: Boolean
 *                   description: status
 *                   example: true
 *                 message:
 *                   type: String
 *                   description: message
 *                   example: 成功撈取所有貼文
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 628ece82750413a09f24eb29
 *                       content:
 *                         type: string
 *                         example: I am Malenia
 *                       image:
 *                         type: string
 *                         example: eldenring.io
 *                       userId:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 628e4f69cc07c6ccd79f783b
 *                           name:
 *                             type: string
 *                             example: malenia
 *                           photo:
 *                             type: string
 *                             example: eldenring.io
 *                       likes:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: 628e4f69cc07c6ccd79f783b
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /posts/{id}:
 *   get:
 *     tags:
 *       - Post 貼文
 *     summary: 取得單一貼文
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 要取得的貼文id 
 *     security:
 *       - bearerAuth: []
 *     description: 取得單一貼文
 *     responses:
 *       200:
 *         description: 取得單一貼文
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: Boolean
 *                   description: status
 *                   example: true
 *                 message:
 *                   type: String
 *                   description: message
 *                   example: 成功取得一則貼文
 *                 data:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                       example: I am Malenia
 *                     image:
 *                       type: string
 *                       example: eldenring.io
 *                     userId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 628e4f69cc07c6ccd79f783b
 *                         name:
 *                           type: string
 *                           example: malenia
 *                         photo:
 *                           type: string
 *                           example: eldenring.io
 *                     likes:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: 628e4f69cc07c6ccd79f783b
 */



/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /posts/create:
 *   post:
 *     tags:
 *       - Post 貼文
 *     summary: 新增一則貼文
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: I am Malenia 
 *     security:
 *       - bearerAuth: []
 *     description: 新增一則貼文
 *     responses:
 *       200:
 *         description: 成功新增一則貼文
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: Boolean
 *                   description: status
 *                   example: true
 *                 message:
 *                   type: String
 *                   description: message
 *                   example: 成功新增一則貼文
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 628e4f69cc07c6ccd79f783b
 *                     content:
 *                       type: string
 *                       example: I am Malenia
 *                     image:
 *                       type: string
 *                       example: eldenring.io
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /posts/{id}:
 *   delete:
 *     tags:
 *       - Post 貼文
 *     summary: 刪除貼文
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 要刪除的貼文id 
 *     security:
 *       - bearerAuth: []
 *     description: 刪除貼文
 *     responses:
 *       200:
 *         description: 刪除一則貼文
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   description: status
 *                   example: success
 *                 message:
 *                   type: String
 *                   description: message
 *                   example: 刪除一則貼文
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /posts/{id}:
 *   patch:
 *     tags:
 *       - Post 貼文
 *     summary: 修改貼文
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 要修改的貼文id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: I am Malenia 
 *     security:
 *       - bearerAuth: []
 *     description: 修改貼文
 *     responses:
 *       200:
 *         description: 修改一則貼文
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: Boolean
 *                   description: status
 *                   example: true
 *                 message:
 *                   type: String
 *                   description: message
 *                   example: 成功編輯一則貼文!!
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 628ed7e88a070399e72fd824
 *                     content:
 *                       type: string
 *                       example: 修改貼文
 *                     image:
 *                       type: string
 *                       example: eldenring.io
 *                     userId:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 628e4f69cc07c6ccd79f783b
 *                         name:
 *                           type: string
 *                           example: malenia
 *                         photo:
 *                           type: string
 *                           example: eldenring.io
 *                     likes:
 *                       type: array
 *                       items:
 *                         type: string
 *                         example: 628e4f69cc07c6ccd79f783b
 *                     createdAt:
 *                       type: string
 *                       example: 2022-05-26T01:29:12.645Z
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /posts/{id}/likes:
 *   post:
 *     tags:
 *       - Post 貼文
 *     summary: 貼文按讚
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 要按讚的貼文id 
 *     security:
 *       - bearerAuth: []
 *     description: 按讚貼文
 *     responses:
 *       200:
 *         description: 按讚一則貼文
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: Boolean
 *                   description: status
 *                   example: true
 *                 message:
 *                   type: String
 *                   description: message
 *                   example: 新增一個讚
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /posts/{id}/likes:
 *   delete:
 *     tags:
 *       - Post 貼文
 *     summary: 貼文取消按讚
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 要取消按讚的貼文id 
 *     security:
 *       - bearerAuth: []
 *     description: 取消按讚貼文
 *     responses:
 *       200:
 *         description: 取消按讚一則貼文
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: Boolean
 *                   description: status
 *                   example: true
 *                 message:
 *                   type: String
 *                   description: message
 *                   example: 刪除一個讚
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /posts/{id}/comment:
 *   post:
 *     tags:
 *       - Post 貼文
 *     summary: 貼文留言
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 要留言的貼文id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: I comment Malenia
 *     security:
 *       - bearerAuth: []
 *     description: 貼文留言
 *     responses:
 *       200:
 *         description: 留言一則貼文
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: Boolean
 *                   description: status
 *                   example: true
 *                 message:
 *                   type: String
 *                   description: message
 *                   example: 成功新增一則留言
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /posts/user/{id}:
 *   get:
 *     tags:
 *       - Post 貼文
 *     summary: 取得單一會員的所有貼文
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 取得單一會員的所有貼文
 *     security:
 *       - bearerAuth: []
 *     description: 取得單一會員的所有貼文
 *     responses:
 *       200:
 *         description: 成功取得單一會員的所有貼文
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: Boolean
 *                   description: status
 *                   example: true
 *                 message:
 *                   type: String
 *                   description: message
 *                   example: 成功取得單一會員的所有貼文
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 629367c0576426461bb3efb9
 *                       content:
 *                         type: string
 *                         example: I am Malenia, blade of Miquella
 *                       image:
 *                         type: string
 *                         example: imgur.io
 *                       userId:
 *                         type: object
 *                         properties:
 *                           avatar:
 *                             type: string
 *                             example: avatar.io
 *                           _id:
 *                             type: string
 *                             example: 628e4f69cc07c6ccd79f783b
 *                           name:
 *                             type: string
 *                             example: malenia
 *                           photo:
 *                             type: string
 *                             example: malenia.io
 *                           gender:
 *                             type: string
 *                             enum: [male, female, x]
 *                             example: female
 *                       likes:
 *                         type: array
 *                         items:
 *                           type: string
 *                           example: 62923ed21d6b70e4b3560200
 *                       createdAt:
 *                         type: string
 *                         example: 2022-05-29T12:32:00.204Z
 *                       comments:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                               example: 6299ed6564c2014a8a97ccd2
 *                             comment:
 *                               type: string
 *                               example: I comment this post is my favor
 *                             user:
 *                               type: object
 *                               properties:
 *                                 avatar:
 *                                   type: string
 *                                   example: avatar.io
 *                                 _id:
 *                                   type: string
 *                                   example: 62923ed21d6b70e4b3560200
 *                                 name:
 *                                   type: string
 *                                   example: miquella
 *                                 photo:
 *                                   type: string
 *                                   example: photo.io
 *                             post:
 *                               type: string
 *                               example: 629367c0576426461bb3efb9
 * 
 * 
 *                                       
 */

