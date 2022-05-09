const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const appError = require('../services/appError');
const jwt = require('jsonwebtoken');
const handleErrorAsync = require('../services/handleErrorAsync');
const User = require('../models/userModel');
const {isAuth, generateSendJWT } = require('../services/auth');




router.get('/profile', isAuth, handleErrorAsync(
     async (req, res, next0) => {
        res.status(200).send( {
            status: true,
            user: req.user,
        } );
} ));


/* 
    修改己登入使用者之密碼
*/
router.post( '/updatePassword',
 isAuth, handleErrorAsync( (req, res, next) => {
    const {password, confirmPassword} = req.body;
    if(password !== confirmPassword){
        return next(appError("400", "密碼不一致", next));
    }

    newPassword = await bcrypt.hash(password, 17);

    const user = await User.findByIdAndUpdate(
        req.user.id, {password: newPassword});

    generateSendJWT(user, 200, res);    

} ) );




module.exports = router;
