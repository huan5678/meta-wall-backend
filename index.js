const socket = io('http://localhost:3000/');
const form = document.getElementById('form');
const input = document.getElementById('sendMessage');
const messages = document.getElementById('messages');
const setToken = document.getElementById('token');
const connectBtn = document.getElementById('connect');
const getHistoryBtn = document.getElementById('history');

const client = socket.on('connect', async () => {
  return await socket.id;
});

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTQ1ZDZiZGVhNmQ1ODMwNTYzNGQyMiIsIm5hbWUiOiLlsI_lgpHigKflr4zlipvlo6siLCJwaG90byI6IiIsImlhdCI6MTY1Mzg5NzQ3MywiZXhwIjoxNjU0NTAyMjczfQ.vzaMEywac1Kfwq7jT6dmIK8IPUSB88oy8eg1mb1byKY';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const userToken = setToken.value || token;
  if (input.value) {
    sendChat(input.value, userToken);
    input.value = '';
  }
});

connectBtn.addEventListener('click', () => {
  const userToken = setToken.value || token;
  enterChatRoom(userToken);
});

getHistoryBtn.addEventListener('click', () => {
  const userToken = setToken.value || token;
  getHistory(userToken);
});

socket.on('coming', (obj) => {
  console.log('coming', obj);
  userComing(obj);
});

socket.on('history', (obj) => {
  if (obj.length > 0) {
    createChatHistory(obj);
  }
});

socket.on('chat message', (obj) => {
  console.log(obj);
  appendData(obj);
});

function userComing(user) {
  const item = document.createElement('li');
  item.innerHTML = `<li class="flex justify-end border-b-2 border-gray-300 py-2">
                <div class="flex gap-2">
                    <div class="font-medium text-gray-500 text-xl">${user.name}</div>
                    <div class="text-gray-600">進入聊天室。</div>
                </div>
            </li>`;
  messages.appendChild(item);
  scrollWindow();
}

function createChatHistory(obj) {
  let html = messages.innerHTML;
  obj.forEach((element) => {
    html += `
            <li class="flex justify-between border-b-2 border-gray-300 py-2">
                <div class="flex">
                    <div class="font-medium text-gray-500 text-xl">${element.userId.name}：</div>
                    <div class="text-gray-600">${element.content}</div>
                </div>
                <div class="text-gray-400">${moment(element.createdAt).fromNow()}</div>
            </li>
            `;
  });
  messages.innerHTML = html.trim();
  scrollWindow();
}

function appendData(obj) {
  const item = document.createElement('li');
  item.innerHTML = `<li class="flex justify-between border-b-2 border-gray-300 py-2">
                <div class="flex">
                    <div class="font-medium text-gray-500 text-xl">${obj.userId.name}：</div>
                    <div class="text-gray-600">${obj.content}</div>
                </div>
                <div class="text-gray-400">${moment(obj.ceratedAt).fromNow()}</div>
            </li>`;
  messages.appendChild(item);
  scrollWindow();
}

function scrollWindow() {
  window.scrollTo(0, document.body.scrollHeight);
}

function sendChat(msg, token) {
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
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => console.dir(err));
}

function enterChatRoom(token) {
  const config = {
    method: 'get',
    url: 'http://localhost:3000/chat/coming',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
  axios(config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.dir(err));
}

function getHistory(token) {
  const data = JSON.stringify({
    socketId: client.id,
  });
  console.log(data);
  const config = {
    method: 'get',
    url: 'http://localhost:3000/chat',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data,
  };
  axios(config)
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.dir(err));
}
