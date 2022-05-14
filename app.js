const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const {traceDeprecation} = require('process');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const app = express();

require('./connections/mongodb');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));

/* 404 錯誤 */
app.use((req, res, next) => {
  res.status(404).send({
    status: false,
    message: '您的路由不存在，請檢查路徑是否正確'
  })
})

app.use((err, req, res) => {
  res.status(500).send({
    status: false,
    err: err.name,
    message: err.message,
  })
})

process.on('uncaughtException', err => {
	console.error('Uncaughted Exception!')
	console.error(err);
	process.exit(1);
});


process.on('unhandledRejection', (reason, promise) => {
  console.error('未捕捉到的 rejection:', promise, '原因：', reason);
});

module.exports = app;
