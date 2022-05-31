const Messages = require('../models/message');

const DB_Password = process.env.DATABASE_PASSWORD;
const DB = process.env.DATABASE_PATH.replace('<password>', DB_Password);

class SocketHandler {
  constructor() {
    this.db;
  }

  connect() {
    this.db = require('mongoose').connect(DB);
    this.db.Promise = global.Promise;
  }

  getMessages() {
    return Messages.find();
  }

  storeMessages(data) {
    console.log(data);
    const newMessages = new Messages({
      userId: data.user._id,
      content: data.msg,
    });

    const doc = newMessages.save();
  }
}

module.exports = SocketHandler;
