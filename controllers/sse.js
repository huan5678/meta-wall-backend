const handleErrorAsync = require('../middleware/handleErrorAsync');

let clients = [];

const eventController = {
  getEvents: (req, response, next) => {
    const id = req.query.id;
    response.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      Connection: 'keep-alive',
    });

    const newClient = {
      id,
      response,
    };

    clients.push(newClient);

    req.on('close', () => {
      console.log(`${id} Connection closed`);
      clients = clients.filter((client) => client.id !== id);
    });
  },
  pushEvents: handleErrorAsync(async (req, res, next) => {
    const newOrderNo = req.order.no;
    const newOrderClientId = req.order.id;
    const newOrderAmt = req.order.amt;
    const sendEventsToAll = () => {
      const result = { id: newOrderClientId, no: newOrderNo, amt: newOrderAmt };
      clients.forEach((client) => client.response.write(`data: ${JSON.stringify(result)}\n\n`));
    };

    return sendEventsToAll();
  }),
};

module.exports = eventController;
