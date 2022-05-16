const jwt = require('jsonwebtoken');
const appError = require('./appError');
const handleErrorAsync = require('./handleErrorAsync');
const express = require('express');
const User = require('../models/userModel');
const isAuth = handleErrorAsync(async (req, res, next) => {
  


    let token;
    if(req.headers.authorization &&
         req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return next(appError(401, '您尚未登入', next));
    }

    const decoded = await new Promise( (resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
            if(err){
                reject(err);
            }else{
                resolve(payload);
            }
        } );
    } );

    const currentUser = await User.findById(decoded.id);
    /* req.user 是自訂的屬性資料, 要將其帶到下一個req */
    req.user = currentUser;
    next();

} );

const generateSendJWT = (user, statusCode, res) => {
    const token = jwt.sign( {id:user._id}, process.env.JWT_SECRET,
         { expiresIn: process.env.JWT_EXPIRES_DAY } );
    user.password = undefined;
    res.status(statusCode).send(
        {
            status: true,
            user: {
                token,
                name: user.name
            }
        }
    );
};

module.exports = {
    isAuth,
    generateSendJWT,
}