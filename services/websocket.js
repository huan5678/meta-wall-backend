const SocketServer = require('ws').Server;

const websocketServer = (server) => {
  const ws = new SocketServer({ server });
  ws.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {
      const msg = JSON.parse(data);
      const clients = ws.clients;
      clients.forEach((client) => {
        client.send(JSON.stringify(msg));
      });
    });
  });
};

module.exports = websocketServer;
