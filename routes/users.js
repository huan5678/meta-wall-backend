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
    /* 
        #swagger.tags = ['Users  -  使用者'] 
        #swagger.description = '使用者註冊頁面 API'
        #swagger.parameters['body'] = {
            in: 'body',
            type: "object",
            required: true,
            description: '資料格式',
            schema: {
                "$name": "Malenia5",
                "$email": "Malenia5@eldenring.io",
                "$password": "password",
                "$confirmPassword": "password",
                "sex": "female",
                "photo":"https://www.windowscentral.com/sites/wpcentral.com/files/styles/xlarge/public/field/image/2022/03/elden-ring-malenia.jpg",
            }
        }
        #swagger.responses[200] = {
            description: '為新使用者產生 token',
            schema: {
                "status": true,
                "user": {
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyN2Y2Mjk2ZjkyYWEwZjI5ZTgxM2M2OCIsImlhdCI6MTY1MjUxNTQ3OCwiZXhwIjoxNjUzMTIwMjc4fQ.94SlCEqzEiyEeLS7QcPujjvJj1HvxJgCqQit2m8qgE8",
                    "name": "Malenia5"
                }
            }

        }
    */
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


/* 使用者登入 
    #swagger.tags = ['Users  -  使用者']
    #swagger.description = '使用者登入頁面 API'

*/
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
      /* 使用者資料維護
    #swagger.tags = ['Users  -  使用者']
    #swagger.description = '使用者資料維護頁面 API'
    #swagger.responses[200] = {
            description: '取得使用者ID和姓名',
            schema: {
                "status": true,
                "user": {
                    "_id": "627f6296f92aa0f29e813c68",
                    "name": "Malenia5",
                },
            },       

    }

    #swagger.security = [{
        "apiKeyAuth": []
    }]

*/
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
            description: '取得使用者ID和姓名',
            schema: {
                "status": true,
                "user": {
                    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyN2Y2Mjk2ZjkyYWEwZjI5ZTgxM2M2OCIsImlhdCI6MTY1MjUyOTUxNywiZXhwIjoxNjUzMTM0MzE3fQ.KhQimkDyVA0v-hck6FknZbaDEf7CvpH5IWHgSqiSNzE",
                    "name": "Malenia5"
                },
            },       

    }

    #swagger.security = [{
        "apiKeyAuth": []
    }]


*/
    const {password, confirmPassword} = req.body;
    if(password !== confirmPassword){
        return next(appError("400", "密碼不一致", next));
    }

    newPassword = await bcrypt.hash(password, 12);

    const user = await User.findByIdAndUpdate(
        req.user.id, {password: newPassword});

    generateSendJWT(user, 200, res);    

} ) );



router.patch('/profile', isAuth, handleErrorAsync( async (req, res, next) => {
    let {name, photo, sex} = req.body;
    if(!name || !photo ||  !sex){
        return next(appError("400", "要修改的欄位未正確填寫", next));
    }
    if(!validator.isURL(photo)){
        return next("400", "請確認照片連結是否正確", next);
    }

    const userId = req.user.id;
    const userData = {name, photo, sex};
    await  User.findByIdAndUpdate(userId, userData);
    const user = await User.findById(userId);
    
    res.status(200).send(

        {
            status: true,
            message: '更新使用者資訊成功', 
            user: user,
            
        }
    )

} ));




module.exports = router;
