# MetaWallBackend
[HexSchool](https://www.hexschool.com/) node.js course.

## Environment
Node.js: v14.19.1

## Quick Start

Install packages:

```sh
npm install
```

Setting Environment Variables
```sh
.env
```

Run Service:

```sh
npm start
```


Run development mode:

```sh
npm start:dev
```

Run production mode:

```sh
npm start:prd
```

Generate Swagger Docs (use Swagger-JsDoc):

```sh
npm run swagger
```

## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- **Validation**: request data validation using [express-validator](https://github.com/express-validator/express-validator)
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [swagger-jsdoc](github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- **Dependency management**: with [Npm](https://www.npmjs.com/)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv)
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **WebSocket**: Realtime chat using [socket.io](https://socket.io/)
- **File Upload**: upload files with [Multer](https://github.com/expressjs/multer) and upload images to [imgur](https://imgur.com/) using [axios](https://github.com/axios/axios)

## Variables

The environment variables sample can be found in the  `config.env`. They come with these default values:

```bash
# backend domain
BACKEND_DOMAIN=
# frontend domain
FRONTEND_DOMAIN=
#discord log in
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
# mongodb
DATABASE_PATH=
DATABASE_PASSWORD=
# upload images to imgur
IMGUR_CLIENT_SECRET=
IMGUR_CLIENTID=
IMGUR_REFRESH_TOKEN=
# jwt secret key
JWT_SECRET=
# jwt token efficient days
JWT_EXPIRES_DAY=
# sign in with line
LINE_CHANNEL_ID=
LINE_CHANNEL_SECRET=
LINE_REDIRECT_URL=
# sign in with google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URL=
# sign in with facebook
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_REDIRECT_URL=
# sign in with discord
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=
# newebpay
NEWEBPAY_DOMAIN=
NEWEBPAY_HASH_IV=
NEWEBPAY_HASH_KEY=
NEWEBPAY_MERCHANT_ID=
# gmail
GMAIL_ACCOUNT=
GMAIL_CLIENT_ID=
GMAIL_CLIENT_SECRET=
GMAIL_REFRESH_TOKEN=
GMAIL_ACCESS_TOKEN=
```
