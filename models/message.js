const mongoose = require('mongoose');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, '使用者的 ID 為必要項目'],
      ref: 'User',
    },
  },
  { versionKey: false },
);
messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'userId',
    select: 'name photo _id',
  });
  next();
});

messageSchema.pre('save', async function () {
  const data = {
    userId: this.userId,
    content: this.content,
  };
  io.emit('message', data);
});
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
