const nodemailer = require('nodemailer');
const User = require('../models/user');
const validator = require('validator');
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
    const transporter = nodemailer.createTransport(
      {
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
      },
      {
        headers: {
          'X-Laziness-level': 1000,
        },
      },
    );
    let message = {
      form: `"Meta Wall Support Ⓜ️" <${process.env.GMAIL_ACCOUNT}>`,
      to: 'Nodemailer <huan5678@gmail.com>',
      subject: 'META WALL 忘記密碼驗證通知信',
      // text: 'For clients with plaintext support only',
      // html: '<p>For clients that do not support AMP4EMAIL or amp content is not valid</p>',
      amp: `<!doctype html>
      <html ⚡4email>
        <head>
          <meta charset="utf-8">
          <style amp4email-boilerplate>body{visibility:hidden}</style>
          <script async src="https://cdn.ampproject.org/v0.js"></script>
          <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
        </head>
        <body>
          <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
          <p>GIF (requires "amp-anim" script in header):<br/>
            <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
        </body>
      </html>`,
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log('Error occurred');
        console.log(error.message);
        return process.exit(1);
      }

      console.log('Message sent successfully!');
      console.log(nodemailer.getTestMessageUrl(info));

      return success(res, '成功送出重置信');
    });
  },
};

module.exports = mailerController;
