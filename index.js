const ws = new WebSocket('ws://localhost:3000');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    sendChat(input.value);
    // ws.send(JSON.stringify({ user: '_id', message: input.value }));
    input.value = '';
  }
});

ws.onopen = () => {
  console.log('open connection');
};

ws.onclose = () => {
  console.log('close connection');
};

ws.onmessage = (e) => {
  console.log(e);
  const data = JSON.parse(e.data);
  const chats = data.Chats;
  if (typeof chats === 'object') {
    chats.forEach((chat) => {
      const item = document.createElement('li');
      item.textContent = chat.content;
      messages.appendChild(item);
    });
  } else {
    const item = document.createElement('li');
    item.textContent = chats.content;
    messages.appendChild(item);
  }
  window.scrollTo(0, document.body.scrollHeight);
  console.dir(data);
};

function sendChat(msg) {
  const data = JSON.stringify({
    content: msg,
  });
  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTQ1ZDZiZGVhNmQ1ODMwNTYzNGQyMiIsIm5hbWUiOiLlsI_lgpHigKflr4zlipvlo6siLCJwaG90byI6IiIsImlhdCI6MTY1Mzg5NzQ3MywiZXhwIjoxNjU0NTAyMjczfQ.vzaMEywac1Kfwq7jT6dmIK8IPUSB88oy8eg1mb1byKY';
  const config = {
    method: 'post',
    url: 'http://localhost:3000/chat',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: data,
  };
  axios(config)
    .then((res) => console.log(res.data))
    .catch((err) => console.dir(err));
  ws.send(
    JSON.stringify({
      token,
      content: msg,
    }),
  );
}
