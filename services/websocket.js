const chatController = require('../controllers/message');
const SocketHandler = require('../controllers/socket');
const ws = require('socket.io');

const websocketServer = (server) => {
  // const io = require('socket.io')(server);
  const io = new ws.Server(server, {
    cors: {
      origin: `*`,
      credentials: true,
    },
    transports: ['websocket'],
    allowRequest: (req, callback) => {
      const noOriginHeader = req.headers.origin === undefined;
      callback(null, noOriginHeader);
    },
  });

  // io.on('connection', async (socket) => {
  //   console.log('New user connected');

  //   const socketHandler = new SocketHandler();

  //   socketHandler.connect();

  //   const history = await socketHandler.getMessages();
  //   socket.broadcast.emit('hello', 'world');
  //   const socketid = socket.id;
  //   io.to(socketid).emit('history', history);

  //   socket.on('message', (message) => {
  //     console.log(`Received message ${message} from user`);
  //   });

  //   socket.on('disconnect', () => {
  //     console.log('disconnected from user');
  //   });
  // });
  io.on('connection', (socket) => {
    console.log('user connection');
    socket.on('chat message', (msg) => {
      console.log('user send message');
      io.emit('chat message', msg);
    });
  });
};

module.exports = websocketServer;
