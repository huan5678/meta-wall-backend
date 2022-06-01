const SocketHandler = require('../controllers/socket');

module.exports = async (io) => {
  io.on('connection', async (socket) => {
    console.log('user connection');
    const socketHandler = new SocketHandler();

    const history = await socketHandler.getMessages();

    const socketid = socket.id;
    io.to(socketid).emit('history', history);
    // socket.broadcast.emit('history', history);

    socket.on('chat message', (msg) => {
      console.log('user send message');
      console.log(msg);
      io.to(socketid).emit('chat message', msg);
      // socket.broadcast.emit('chat message', msg);
    });

    socket.on('typing', (boolean) => {
      socket.broadcast.emit('typing', boolean);
    });

    socket.on('error', (err) => {
      socket.emit('error', err.message);
    });

    socket.on('disconnect', () => {
      console.log('disconnected from user');
    });
  });
};
