const express = require('express');

const router = express.Router();
const appError = require('../utils/appError');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const sizeOf = require('image-size');
const upload = require('../utils/image');
const { ImgurClient } = require('imgur');
const { isAuthor } = require('../middleware/handleJWT');
const handleSuccess = require('../utils/successHandle');

router.post(
  '/',
  isAuthor,
  upload,
  handleErrorAsync(async (req, res, next) => {
    if (!req.files.length) {
      return next(appError(400, '尚未上傳檔案', next));
    }
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID,
    });
    return handleSuccess(res, response.data.link);
  }),
);

module.exports = router;



/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /upload:
 *   post:
 *     tags:
 *       - Upload
 *     summary: 圖片上傳
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 description: array of files of picture 
 *     security:
 *       - bearerAuth: []
 *     description: this is description
 *     responses:
 *       200:
 *         description: data.link of Imgur
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
 *                   example: 上傳圖片成功
 *                 data:
 *                   type: String
 *                   description: Imgur data.link
 *                   example: xxxx
 */