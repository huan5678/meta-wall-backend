const socket = io('/', { transports: ['websocket'] });
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

// socket.on('history', (obj) => {
//   if (obj.length > 0) {
//     appendData(obj);
//   }
// });

// socket.on('message', (obj) => {
//   console.log(obj);
//   appendData([obj]);
// });

function appendData(obj) {
  let html = messages.innerHTML;

  obj.forEach((element) => {
    html += `
            <li class="chat">
                <div class="group">
                    <div class="name">${element.name}：</div>
                    <div class="msg">${element.msg}</div>
                </div>
                <div class="time">${moment(element.time).fromNow()}</div>
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
}
