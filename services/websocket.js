const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const appError = require('../utils/appError');
const SocketHandler = require('../controllers/socket');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const websocketServer = (server) => {
  const io = new Server(server, {
    path: '/socket.io',
    cors: {
      origin: `*`,
      credentials: true,
    },
  });

  io.of('/chat').on('connection', async (socket) => {
    console.log('New user connected');
    const socketHandler = new SocketHandler();

    socketHandler.connect();

    const history = await socketHandler.getMessages();

    const socketid = socket.id;
    io.to(socketid).emit('history', history);

    const token = socket.handshake.query?.token;
    console.log(socket.handshake);
    let userId = await getUserId(token);

    socket.use(([event, payload], next) => {
      console.log('payload', payload);
      if (payload?.message?.length > 100) {
        return appError(400, '字數過多請減量', next);
      }
      next();
    });

    io.use((socket, next) => {
      const token = socket.handshake.query?.token;
      if (!token) {
        return appError(400, '驗證失敗請重新登入', next);
      }
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return appError(400, '驗證失敗請重新登入', next);
        socket.decoded = decoded;
        next();
      });
    });

    const getUserId = async (token) => {
      const decodedToken = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
          error ? reject(error) : resolve(payload);
        });
      });
      const currentUser = await User.findById(decodedToken.id);
      return currentUser?._id;
    };

    socket.on('chatMessage', async (msg) => {
      const { message } = msg;
      const data = {
        msg: message,
        id: getUserId(token),
      };
      await socketHandler.storeMessages(data);

      io.of('/chat').emit('chatMessage', { message, userId });
      console.log('userInfo', userId);
      console.log(`client send message`, msg);
    });

    socket.on('typing', (boolean) => {
      socket.broadcast.emit('typing', boolean);
    });

    socket.on('message', (message) => {
      console.log(`Received message ${message} from user`);
    });

    socket.on('error', (err) => {
      socket.emit('error', err.message);
    });

    socket.on('disconnect', () => {
      console.log('disconnected from user');
    });
  });
  io.of('/chat').on('connect_error', (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  return io;
};

module.exports = websocketServer;
