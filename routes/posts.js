const express = require('express');
const router = express.Router();
const Post = require('../models/post');
const successHandle = require('../utils/successHandle');
const postController = require('../controllers/post');
const { isAuthor } = require('../middleware/handleJWT');

//資料全撈
router.get('/', postController.getAll);
router.get('/:id', postController.getOne);
router.post('/create', isAuthor, postController.postCreate);
router.delete('/:id', isAuthor, postController.postDelete);
router.patch('/:id', isAuthor, postController.postPatch);
router.post('/:id/likes', isAuthor, postController.addLike);
router.delete('/:id/likes', isAuthor, postController.deleteLike);

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