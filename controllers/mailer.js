const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const validator = require('validator');

const User = require('../models/user');
const successHandle = require('../utils/successHandle');
const appError = require('../utils/appError');

const mailerController = {
  sendResetEmail: async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
      return appError(400, '請填入 email 欄位', next);
    }
    if (!validator.isEmail(email)) {
      return appError(400, '請正確輸入 email 格式', next);
    }
    const user = await User.findOne({ email }).exec();
    if (!user) {
      return appError(400, '無此帳號，請再次確認註冊 Email 帳號，或是重新註冊新帳號', next);
    }
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_ACCOUNT,
        clientId: process.env.GMAIL_CLIENT_ID,
        clientSecret: process.env.GMAIL_CLIENT_SECRET,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        accessToken: process.env.GMAIL_ACCESS_TOKEN,
      },
    });

    ejs.renderFile(
      path.resolve('./views/resetPassword.ejs'),
      { userName: user.name, resetUrl: `https://localhost:3000/user/${user._id}/reset_password` },
      function (err, data) {
        if (err) {
          console.log(err);
        } else {
          const mainOptions = {
            from: `"Meta Wall Support Ⓜ️" <${process.env.GMAIL_ACCOUNT}>`,
            to: `${user.name} <huan5678@gmail.com>`,
            subject: 'META WALL 忘記密碼驗證通知信',
            html: data,
          };
          console.log('html data ======================>', mainOptions.html);
          transporter.sendMail(mainOptions, function (err, info) {
            if (err) {
              console.log(err);
            } else {
              console.log('Message sent: ' + info.response);
              return success(res, '成功送出重置信');
            }
          });
        }
      },
    );
  },
};

module.exports = mailerController;
