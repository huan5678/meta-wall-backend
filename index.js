const ws = new WebSocket('ws://localhost:3000');

const form = document.getElementById('form');
const input = document.getElementById('input');

const loginForm = document.getElementById('login');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value) {
    ws.send(JSON.stringify({ user: '_id', message: input.value }));
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
    let message = 'Hi Hi';
    ws.send(JSON.stringify({ userID: userId, name: userName, message }));
  });
});

ws.onopen = () => {
  const data = JSON.stringify({ user: '_id', status: 'join' });
  ws.send(data);
  console.log('open connection');
};

ws.onclose = () => {
  const data = JSON.stringify({ user: '_id', status: 'leave' });
  ws.send(data);
  console.log('close connection');
};

ws.onmessage = (e) => {
  const msg = e.data;
  console.dir(msg);
};
