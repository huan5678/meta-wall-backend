module.exports = async (io) => {
  io.on('connection', async (socket) => {
    console.log('user connection');

    socket.on('disconnect', () => {
      console.log('disconnected from user');
    });
  });
};
