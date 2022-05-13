const express = require('express');
const router = express.Router();
const validator = require('validator');
const bcrypt = require('bcrypt');
const appError = require('../services/appError');
const jwt = require('jsonwebtoken');
const handleErrorAsync = require('../services/handleErrorAsync');
const User = require('../models/userModel');
const {isAuth, generateSendJWT } = require('../services/auth');


router.post('/sign_up', handleErrorAsync( async (req, res, next) => {
    console.log(req.body);
    let {email, password, confirmPassword, name} = req.body;

    //有欄位未填寫
    if(!email || !password || !confirmPassword || !name) {
        return next( appError("400", "有欄位未填寫正確", next) );
    }

    // 確認密碼正確
    if(password !== confirmPassword){
        return next( appError("400", "密碼不一致", next) );
    }

    /* 密碼要8碼以上 */
    if(!validator.isLength(password, {min: 8})){
        return next( appError("400", "密碼小於8碼", next) );
    }

    /* email格式是否正確 */
    if(!validator.isEmail(email)){
        return next( appError("400", "email格式不正確", next) );
    }

    /* 將密碼加密 */
    password = await bcrypt.hash(req.body.password, 12);

    /* 將新使用者寫入DB */
    const newUser = await User.create(
        {
            email,
            password,
            name,
        }
    );
    
    /* 為新使用者產生 token */
    generateSendJWT(newUser, 201, res);

} ));


/* 使用者登入 */
router.post('/sign_in', handleErrorAsync( async (req, res, next) => {
    const {email, password} = req.body;
    if(!email || !password){
        return next( appError("400", "帳號密碼不可為空", next) );
    }

    const user = await User.findOne( {email} ).select('+password');
    const auth = await bcrypt.compare(password, user.password);

    if(!auth){
        return next( appError("400", "輸入的密碼不正確", next) );
    }

    generateSendJWT(user, 200, res);

} ));





router.get('/profile', isAuth, handleErrorAsync(
     async (req, res, next) => {
        res.status(200).send( {
            status: true,
            user: req.user,
        } );
} ));


/* 
    修改己登入使用者之密碼
*/
router.post( '/updatePassword',
 isAuth, handleErrorAsync( async (req, res, next) => {
    const {password, confirmPassword} = req.body;
    if(password !== confirmPassword){
        return next(appError("400", "密碼不一致", next));
    }

    newPassword = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(
        req.user.id, {password: newPassword});

    generateSendJWT(user, 200, res);    

} ) );




module.exports = router;
