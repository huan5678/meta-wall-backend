const socket = io('http://localhost:3000/');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const connect = document.getElementById('connect');

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTQ1ZDZiZGVhNmQ1ODMwNTYzNGQyMiIsIm5hbWUiOiLlsI_lgpHigKflr4zlipvlo6siLCJwaG90byI6IiIsImlhdCI6MTY1Mzg5NzQ3MywiZXhwIjoxNjU0NTAyMjczfQ.vzaMEywac1Kfwq7jT6dmIK8IPUSB88oy8eg1mb1byKY';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    sendChat(input.value);
    // ws.send(JSON.stringify({ user: '_id', message: input.value }));
    input.value = '';
  }
});

connect.addEventListener('click', (e) => getMessages());

socket.on('history', (obj) => {
  if (obj.length > 0) {
    appendData(obj);
  }
});

socket.on('message', (obj) => {
  console.log(obj);
  appendData([obj]);
});

socket.on('chat message', (obj) => {
  console.log(obj);
  appendData([obj]);
});

function appendData(obj) {
  let html = messages.innerHTML;

  obj.forEach((element) => {
    html += `
            <li class="flex justify-between border-b-2 border-gray-300 py-2">
                <div class="flex">
                    <div class="font-medium text-gray-500 text-xl">${element.userId.name}：</div>
                    <div class="text-gray-600">${element.content}</div>
                </div>
                <div class="text-gray-400">${moment(element.ceratedAt).fromNow()}</div>
            </li>
            `;
  });
  messages.innerHTML = html.trim();
  scrollWindow();
}

function scrollWindow() {
  window.scrollTo(0, document.body.scrollHeight);
}

function sendChat(msg) {
  const data = JSON.stringify({
    content: msg,
  });
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
}

function getMessages() {
  // const config = {
  //   method: 'get',
  //   url: 'http://localhost:3000/chat/',
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  // axios(config)
  //   .then((res) => console.log(res.data))
  //   .catch((err) => console.dir(err));
  socket.emit('chat message', 'Client 發送訊息');
}
