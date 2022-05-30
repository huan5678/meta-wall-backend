const SocketServer = require('ws').Server;
const { chatController, preloadChat } = require('../controllers/chat');
const websocketServer = (server) => {
  const wss = new SocketServer({ noServer: true });
  server.on('upgrade', function (request, socket, head) {
    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request);
    });
  });
  wss.on('connection', async (ws, request, client) => {
    ws.isAlive = true;
    ws.on('pong', () => {
      ws.isAlive = true;
    });
    console.log('Client connected');

    ws.on('message', function message(data) {
      console.log(`Received message ${data} from user ${client}`);
      ws.send(data);
    });
    preloadChat(ws);
  });
};

module.exports = websocketServer;
