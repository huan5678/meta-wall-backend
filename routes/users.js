const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const thirdPartyController = require('../controllers/thirdParty');
const mailerController = require('../controllers/mailer');
const { isAuthor } = require('../middleware/handleJWT');
const handleErrorAsync = require('../middleware/handleErrorAsync');

router.post('/create', handleErrorAsync(userController.userCreate));
router.post('/login', handleErrorAsync(userController.userLogin));
router.get('/profile', isAuthor, handleErrorAsync(userController.getProfile));
router.patch('/profile', isAuthor, handleErrorAsync(userController.updateProfile));
router.get('/profile/:id', isAuthor, handleErrorAsync(userController.getSpecUserProfile));
router.post('/update_password', isAuthor, handleErrorAsync(userController.updatePassword));
router.post('/forget_password', handleErrorAsync(mailerController.sendResetEmail));
router.patch('/reset_password', handleErrorAsync(userController.resetPassword));

router.get('/facebook', handleErrorAsync(thirdPartyController.loginWithFacebook));
router.get('/facebook/callback', handleErrorAsync(thirdPartyController.facebookCallback));
router.get('/google', handleErrorAsync(thirdPartyController.loginWithGoogle));
router.get('/google/callback', handleErrorAsync(thirdPartyController.googleCallback));
router.get('/line', handleErrorAsync(thirdPartyController.loginWithLine));
router.get('/line/callback', handleErrorAsync(thirdPartyController.lineCallback));
router.get('/discord', handleErrorAsync(thirdPartyController.loginWithDiscord));
router.get('/discord/callback', handleErrorAsync(thirdPartyController.discordCallback));

router.post('/:id/follow', isAuthor, handleErrorAsync(userController.addFollower));
router.delete('/:id/unfollow', isAuthor, handleErrorAsync(userController.deleteFollower));
router.get('/getLikesList', isAuthor, handleErrorAsync(userController.getLikesList));
router.get('/getFollowList', isAuthor, handleErrorAsync(userController.getFollowList));

module.exports = router;



/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /user/create:
 *   post:
 *     tags:
 *       - User 使用者
 *     summary: 建立使用者
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword               
 *             properties:
 *               name:
 *                 type: string
 *                 description: 名字長度至少2個字
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: 密碼長度至少8個字 
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: 密碼長度至少8個字     
 *     description: 建立使用者帳號
 *     responses:
 *       200:
 *         description: 成功建立使用者帳號
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
 *                   example: 成功建立使用者帳號
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: xyzyayayayay
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: xxxxxxxxxx
 *                         name:
 *                           type: string
 *                           example: Nate
 *                         avatar:
 *                           type: string
 *                           example: elderring.io
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /user/login:
 *   post:
 *     tags:
 *       - User 使用者
 *     summary: 使用者登入
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password               
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: Malenia@eldenring.io
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 1Password!     
 *     description: 使用者登入
 *     responses:
 *       200:
 *         description: 登入成功
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
 *                   example: 登入成功
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: xxxxxxxxxx
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: xxxxxxxxxxxxx
 *                         name:
 *                           type: string
 *                           example: malenia
 *                         avatar:
 *                           type: string
 *                           example: eldenring.io
 *                     
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /user/update_password:
 *   post:
 *     tags:
 *       - User 使用者
 *     summary: 使用者更新密碼
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *                 description: 新密碼
 *                 example: 1Password!
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: 再輸入一次新密碼
 *                 example: 1Password! 
 *     security:
 *       - bearerAuth: []
 *     description: this is description
 *     responses:
 *       200:
 *         description: 成功更新使用者密碼
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
 *                   example: 成功更新使用者密碼
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /user/profile:
 *   get:
 *     tags:
 *       - User 使用者
 *     summary: 取得使用者資訊 
 *     security:
 *       - bearerAuth: []
 *     description: 取得使用者資訊
 *     responses:
 *       200:
 *         description: 成功取得使用者資訊
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
 *                   example: 成功取得使用者資訊
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: userId
 *                       example: 628e4f69cc07c6ccd79f783b
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: email
 *                       example: Malenia@eldenring.io
 *                     password:
 *                       type: string
 *                       format: password
 *                       description: password
 *                       example: xxxxxxxxx
 *                     name:
 *                       type: string
 *                       description: name
 *                       example: Malenia
 *                     avatar:
 *                       type: string
 *                       description: link to figure
 *                       example: xxxxxxxxxxxxxxx
 *                     isValidator:
 *                       type: Boolean
 *                       description: isValidator
 *                       example: true
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: string
 *                             example: 62923ed21d6b70e4b3560200
 *                           createdAt:
 *                             type: string
 *                             example: 2022-06-03T08:08:59.345Z
 *                       description: 追踪我的人的id
 *                     following:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                             properties:
 *                               avatar:
 *                                 type: string
 *                                 example: avatar.io
 *                               _id:
 *                                 type: string
 *                                 example: 62923ed21d6b70e4b3560200
 *                               name:
 *                                 type: string
 *                                 example: miquella
 *                               photo:
 *                                 type: string
 *                                 example: eldenring.io
 *                           createdAt:
 *                             type: string
 *                             example: 2022-05-30T11:16:42.359Z
 *                     gender:
 *                       type: string
 *                       enum: [male, female, x]
 *                       description: 性別
 *                       example: female
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /user/profile:
 *   patch:
 *     tags:
 *       - User 使用者
 *     summary: 更新使用者資訊
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: user name
 *                 example: malenia
 *               avatar:
 *                 type: string
 *                 description: 使用者照片的網址
 *                 example: malenia.io
 *               gender:
 *                 type: string
 *                 enum: [male,female, x]
 *                 example: female 
 *     security:
 *       - bearerAuth: []
 *     description: this is description
 *     responses:
 *       200:
 *         description: 更新使用者資訊
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
 *                   example: 成功更新使用者資訊
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: 使用者姓名
 *                       example: malenia
 *                     gender:
 *                       type: string
 *                       enum: [male, female, x]
 *                       description: 姓別
 *                       example: female
 *                     avatar:
 *                       type: string
 *                       description: 使用者相片網址
 *                       example: eldenring.io/malenia
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /{id}/follow:
 *   post:
 *     tags:
 *       - User 使用者
 *     summary: 加入追踪名單
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 要追踪的使用者id 
 *     security:
 *       - bearerAuth: []
 *     description: 加入追踪名單
 *     responses:
 *       200:
 *         description: 您己成功追踪
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
 *                   example: 您己成功追踪
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /{id}/unfollow:
 *   delete:
 *     tags:
 *       - User 使用者
 *     summary: 取消加入追踪名單
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 要取消追踪的使用者id 
 *     security:
 *       - bearerAuth: []
 *     description: 取消追踪
 *     responses:
 *       200:
 *         description: 您己成功取消追踪
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
 *                   example: 您己成功取消追踪
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /user/getLikesList:
 *   get:
 *     tags:
 *       - User 使用者
 *     summary: 取得按讚名單
 *     security:
 *       - bearerAuth: []
 *     description: 取得按讚名單
 *     responses:
 *       200:
 *         description: 成功取得按讚名單
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
 *                   example: 成功取得按讚表單
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: ['62923ed21d6b70e4b3560200',]
 */


/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /getFollowList:
 *   get:
 *     tags:
 *       - User 使用者
 *     summary: 取得按讚名單
 *     security:
 *       - bearerAuth: []
 *     description: 取得追踪名單
 *     responses:
 *       200:
 *         description: 成功取得追踪名單
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
 *                   example: 成功取得按讚表單
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       following:
 *                         type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                             properties:
 *                               avatar:
 *                                 type: string
 *                                 example: avatar.io
 *                               _id:
 *                                 type: string
 *                                 example: 62923ed21d6b70e4b3560200
 *                               name:
 *                                 type: string
 *                                 example: miquella
 *                               photo:
 *                                 type: string
 *                                 example: imgur.io
 *                           createdAt:
 *                             type: string
 *                             example: 2022-05-30T11:16:42.359Z
 */
