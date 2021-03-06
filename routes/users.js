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
 *       - User ?????????
 *     summary: ???????????????
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
 *                 description: ??????????????????2??????
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: ??????????????????8?????? 
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: ??????????????????8??????     
 *     description: ?????????????????????
 *     responses:
 *       200:
 *         description: ???????????????????????????
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
 *                   example: ???????????????????????????
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
 *       - User ?????????
 *     summary: ???????????????
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
 *     description: ???????????????
 *     responses:
 *       200:
 *         description: ????????????
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
 *                   example: ????????????
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
 *       - User ?????????
 *     summary: ?????????????????????
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
 *                 description: ?????????
 *                 example: 1Password!
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: ????????????????????????
 *                 example: 1Password! 
 *     security:
 *       - bearerAuth: []
 *     description: this is description
 *     responses:
 *       200:
 *         description: ???????????????????????????
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
 *                   example: ???????????????????????????
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
 *       - User ?????????
 *     summary: ????????????????????? 
 *     security:
 *       - bearerAuth: []
 *     description: ?????????????????????
 *     responses:
 *       200:
 *         description: ???????????????????????????
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
 *                   example: ???????????????????????????
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
 *                       description: ??????????????????id
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
 *                       description: ??????
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
 *       - User ?????????
 *     summary: ?????????????????????
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
 *                 description: ????????????????????????
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
 *         description: ?????????????????????
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
 *                   example: ???????????????????????????
 *                 data:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: ???????????????
 *                       example: malenia
 *                     gender:
 *                       type: string
 *                       enum: [male, female, x]
 *                       description: ??????
 *                       example: female
 *                     avatar:
 *                       type: string
 *                       description: ?????????????????????
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
 *       - User ?????????
 *     summary: ??????????????????
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ?????????????????????id 
 *     security:
 *       - bearerAuth: []
 *     description: ??????????????????
 *     responses:
 *       200:
 *         description: ??????????????????
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
 *                   example: ??????????????????
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
 *       - User ?????????
 *     summary: ????????????????????????
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ???????????????????????????id 
 *     security:
 *       - bearerAuth: []
 *     description: ????????????
 *     responses:
 *       200:
 *         description: ????????????????????????
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
 *                   example: ????????????????????????
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
 *       - User ?????????
 *     summary: ??????????????????
 *     security:
 *       - bearerAuth: []
 *     description: ??????????????????
 *     responses:
 *       200:
 *         description: ????????????????????????
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
 *                   example: ????????????????????????
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
 *       - User ?????????
 *     summary: ??????????????????
 *     security:
 *       - bearerAuth: []
 *     description: ??????????????????
 *     responses:
 *       200:
 *         description: ????????????????????????
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
 *                   example: ????????????????????????
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
