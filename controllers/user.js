const bcrypt = require('bcryptjs');
const validator = require('validator');
const User = require('../models/user');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/sucessHandle');
const appError = require('../utils/appError');
const {generateToken} = require('../middleware/handleJWT');
const {passwordCheck} = require('../utils/passwordCheck');

const userController = {
  userCreate: handleErrorAsync(async (req, res, next) => {
    let {email, password, confirmPassword, name} = req.body;
    if (!email || !password || !confirmPassword || !name) {
      return appError(400, '欄位未正確填寫', next);
    }
    if (name.length <= 1) {
      return appError(400, '名字長度至少 2 個字', next);
    }
    if (password.length <= 7 || confirmPassword.length <= 7) {
      return appError(400, '密碼長度至少 8 個字', next);
    }
    if (!validator.isEmail(email)) {
      return appError(400, '請正確輸入 email 格式', next);
    }
    passwordCheck(password, next);

    if (password !== confirmPassword) {
      return appError(400, '請確認兩次輸入的密碼是否相同', next);
    }

    const user = await User.findOne({email}).exec();
    if (user) {
      return appError(400, '此帳號已有人使用，請試試其他 Email 帳號', next);
    }

    const userData = {
      name,
      email,
      password,
      isValidator: true,
    };
    await User.create(userData);
    return successHandle(res, '成功建立使用者帳號');
  }),
  userLogin: handleErrorAsync(async (req, res, next) => {
    /* 使用者登入 
        #swagger.tags = ['Users  -  使用者']
        #swagger.description = '使用者登入頁面 API'
        #swagger.parameters['body'] = {
            in: 'body',
            type: "object",
            required: true,
            description: '資料格式',
            schema: {
                "$email": "Malenia5@eldenring.io",
                "$password": "password",
                
            }
        }
        #swagger.responses[200] = {
            description: '為登入使用者產生 token',
            schema: {
                "status": true,
                "message": "登入成功",
                "data": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyN2Y2Mjk2ZjkyYWEwZjI5ZTgxM2M2OCIsImlhdCI6MTY1MjUxNTQ3OCwiZXhwIjoxNjUzMTIwMjc4fQ.94SlCEqzEiyEeLS7QcPujjvJj1HvxJgCqQit2m8qgE8",
                
            }

        }
    */


    const {email, password} = req.body;
    if (!email || !password) {
      return appError(400, 'email 或 password 欄位未正確填寫', next);
    }
    const user = await User.findOne({email});
    if (!user) {
      return appError(404, '無此使用者資訊請確認 email 帳號是否正確', next);
    }
    const userPassword = await User.findOne({email}).select('+password');
    const checkPassword = bcrypt.compareSync(req.body.password, userPassword.password);
    if (!checkPassword) {
      return appError(400, '請確認密碼是否正確，請再嘗試輸入', next);
    }
    const token = generateToken(user);
    return successHandle(res, '登入成功', token);
  }),
  getProfile: handleErrorAsync(async (req, res, next) => {
      /* 
        #swagger.tags = ['Users  -  使用者'] 
        #swagger.description = '使用者資訊頁面 API'
        #swagger.parameters['body'] = {
            in: 'body',
            type: "object",
            required: true,
            description: '資料格式',
            schema: {
                "$id": "Malenia5",
            }
        }
        #swagger.responses[200] = {
            description: '成功取得使用者資訊',
            schema: {
                "status": true,
                "message": "成功取得使用者資訊",
                user,
                
            }

        }
    */

    const userId = req.user.id;
    const user = await User.findById(userId);
    return successHandle(res, '成功取得使用者資訊', user);
  }),
  updatePassword: handleErrorAsync(async (req, res, next) => {
    /*  
    #swagger.tags = ['Users  -  使用者']
    #swagger.description = '使用者變更密碼頁面 API'
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: true,
        description: '資料格式',
        schema: {
            "password": "password1",
            "confirmPassword": "password1"  
        },
    } 
    #swagger.responses[200] = {
            description: '成功更新使用者密碼',
            schema: {
                "status": true,
                "message": "成功更新使用者密碼",
                
            },       

    }

    #swagger.security = [{
        "apiKeyAuth": []
    }]


    */

    let {password, confirmPassword} = req.body;
    if (!password || !confirmPassword) {
      return appError(400, '欄位未正確填寫', next);
    }
    if (password.length <= 7 || confirmPassword.length <= 7) {
      return appError(400, '密碼長度至少 8 個字', next);
    }
    passwordCheck(password, next);
    if (password !== confirmPassword) {
      return appError(400, '請確認兩次輸入的密碼是否相同', next);
    }
    const userId = req.user.id;
    await User.findByIdAndUpdate(userId, password);
    return successHandle(res, '成功更新使用者密碼！', {});
  }),
  updateProfile: handleErrorAsync(async (req, res, next) => {
      /* 
        #swagger.tags = ['Users  -  使用者'] 
        #swagger.description = '使用者更新頁面 API'
        #swagger.parameters['body'] = {
            in: 'body',
            type: "object",
            required: true,
            description: '資料格式',
            schema: {
                "$name": "Malenia5",
                "$photo": "www@eldenring.io/Malenia5",
                "$gender": "female",
                
            }
        }
        #swagger.responses[200] = {
            description: '成功更新使用者資訊',
            schema: {
                "status": true,
                "message": "成功更新使用者資訊！",
                
            }

        }
    */



    let {name, photo, gender} = req.body;
    if (!name && !photo && !gender) {
      return appError(400, '要修改的欄位未正確填寫', next);
    }
    if (!validator.isURL(photo)) {
      return appError(400, '請確認照片是否傳入網址', next);
    }
    const userId = req.user.id;
    const userData = {name, photo, gender};
    await User.findByIdAndUpdate(userId, userData, {runValidators: true});
    const user = await User.findById(userId);
    return successHandle(res, '成功更新使用者資訊！', user);
  }),
};

module.exports = userController;