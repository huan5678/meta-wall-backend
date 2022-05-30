const ws = new WebSocket('ws://localhost:3000');
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const loginForm = document.getElementById('login');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    sendChat(input.value);
    // ws.send(JSON.stringify({ user: '_id', message: input.value }));
    input.value = '';
  }
});

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(loginForm);
  const email = data.get('email');
  const password = data.get('password');
  const baseUrl = 'http://localhost:3000/user/login';
  const result = {
    email,
    password,
  };
  axios.post(baseUrl, result).then((res) => {
    const { data } = res.data;
    const userName = data.user.name;
    const userId = data.user.id;
    console.log('token = ', data.token);
    console.log(userId, userName);
  });
});

ws.onopen = () => {
  console.log('open connection');
};

ws.onclose = () => {
  console.log('close connection');
};

ws.onmessage = (e) => {
  const item = document.createElement('li');
  const msg = JSON.parse(e.data);
  item.textContent = msg.message;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
  console.dir(msg);
};

function sendChat(msg) {
  const data = JSON.stringify({
    content: msg,
  });
  const config = {
    method: 'post',
    url: 'http://localhost:3000/chat',
    headers: {
      Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyOTQ1ZDZiZGVhNmQ1ODMwNTYzNGQyMiIsIm5hbWUiOiLlsI_lgpHigKflr4zlipvlo6siLCJwaG90byI6IiIsImlhdCI6MTY1Mzg5NzQ3MywiZXhwIjoxNjU0NTAyMjczfQ.vzaMEywac1Kfwq7jT6dmIK8IPUSB88oy8eg1mb1byKY`,
      'Content-Type': 'application/json',
    },
    data: data,
  };
  axios(config)
    .then((res) => console.log(res.data))
    .catch((err) => console.dir(err));
}
