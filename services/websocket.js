const SocketServer = require('ws').Server;

const webSocketService = (server) => {
  const wss = new SocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {
      // ws.send(data);
      console.log(JSON.parse(data));
      const msg = JSON.parse(data);
      const clients = wss.clients;
      clients.forEach((client) => {
        client.send(JSON.stringify(msg));
      });
    });

    ws.on('close', () => {
      console.log('Close connected');
    });
  });
};

module.exports = webSocketService;
