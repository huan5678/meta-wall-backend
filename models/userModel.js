const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
    {
        name:{
            type: String, 
            required: [true, '請輸入姓名'],
        },
        email:{
            type: String,
            required: [true, '請輸入email'],
            unique: true,
            select: false,

        },
        photo:String,
        sex:{
            type: String,
            enum: ['male', 'female'],
        },
        password:{
            type: String,
            required: [true, '請輸入密碼'],
            minlength: 8,
            select: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            select: false,
        }
    },
    {
        versionKey: false,
    },
);


const User = mongoose.model('user', userSchema);


module.exports = User;