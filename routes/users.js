const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const {isAuthor} = require('../middleware/handleJWT');



router.post('/user/create', userController.userCreate
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
                "$password": "1passwordP!@",
                "$confirmPassword": "1passwordP!@",
                
            }
        }
        #swagger.responses[200] = {
            description: '建立新使用者',
            schema: {
                "status": true,
                "message": "成功建立使用者帳號",
                
            }

        }
    */
);
router.post('/user/login', userController.userLogin
        
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
                "$password": "1passwordP!@",
                
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

);
router.post('/user/update_password', isAuthor, userController.updatePassword
        
    /*  
    #swagger.tags = ['Users  -  使用者']
    #swagger.description = '使用者變更密碼頁面 API'
    #swagger.parameters['body'] = {
        in: 'body',
        type: 'object',
        required: true,
        description: '資料格式',
        schema: {
            "password": "2passwordP!@",
            "confirmPassword": "2passwordP!@"  
        },
    } 
    #swagger.responses[200] = {
            description: '取得使用者ID和姓名',
            schema: {
                "status": true,
                "message": "成功更新使用者密碼！",
                "data": {},
                
            },       

    }

    #swagger.security = [{
        "apiKeyAuth": []
    }]


    */


);
router.get('/user/profile', isAuthor, userController.getProfile
    
    /* 
        #swagger.tags = ['Users  -  使用者'] 
        #swagger.description = '使用者資訊頁面 API 必須先登入'
        #swagger.responses[200] = {
            description: '成功取得使用者資訊',
            schema: {
                "status": true,
                "message": "成功取得使用者資訊",
                "data": {
                    "name": "Malenia",
                    "gender": "female",
                    "photo": "www.melenia.io/Malenia5"
                }
            }

        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
    */

);
router.patch('/user/profile', isAuthor, userController.updateProfile
        
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
                "data": {
                    "_id": "6287ab1f27b974b47dd93328",
                    "email": "Malenia@eldenring.io",
                    "password": "$2a$08$ocKhYvf/BoKIcp4PRzohh.HA/arrLYgZ1lBRlARRk5JA1MXGswaba",
                    "name": "Malenia",
                    "isValidator": true,
                    "gender": "male",
                    "photo": "www@eldenring.io/Malenia"
            }
                
            }

        }
        #swagger.security = [{
            "apiKeyAuth": []
        }]
    */
);

module.exports = router;