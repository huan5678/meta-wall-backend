const User = require('../models/user');
const handleErrorAsync = require('../middleware/handleErrorAsync');
const successHandle = require('../utils/successHandle');
const { generateToken } = require('../middleware/handleJWT');
const { randomPassword } = require('../utils/passwordRule');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const createEmail = require('../utils/createEmail');

// const google_redirect_url = process.env.GOOGLE_REDIRECT_URL;
const google_redirect_url = 'http://localhost:3000/user/google/callback';
const google_client_id = process.env.GOOGLE_CLIENT_ID;
const google_client_secret = process.env.GOOGLE_CLIENT_SECRET;

// const line_redirect_url = process.env.LINE_REDIRECT_URL;
const line_redirect_url = 'http://localhost:3000/user/line/callback';
const line_channel_id = process.env.LINE_CHANNEL_ID;
const line_channel_secret = process.env.LINE_CHANNEL_SECRET;
const line_state = 'mongodb-express-line-login';

const facebook_client_id = process.env.FACEBOOK_CLIENT_ID;
const facebook_client_secret = process.env.FACEBOOK_CLIENT_SECRET;
// const facebook_redirect_url = process.env.FACEBOOK_REDIRECT_URL;
const facebook_redirect_url = 'http://localhost:3000/user/facebook/callback';

const discord_client_id = process.env.DISCORD_CLIENT_ID;
const discord_client_secret = process.env.DISCORD_CLIENT_SECRET;
// const discord_redirect_url = process.env.DISCORD_REDIRECT_URL;
const discord_state = 'mongodb-express-discord';
const discord_redirect_url = 'http://localhost:3000/user/discord/callback';

const tokenHeader = {
  'Content-Type': 'application/x-www-form-urlencoded',
};

const thirdPartyController = {
  loginWithGoogle: handleErrorAsync(async (req, res, next) => {
    const query = {
      redirect_uri: google_redirect_url,
      client_id: google_client_id,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    };
    const auth_url = 'https://accounts.google.com/o/oauth2/auth';
    const queryString = new URLSearchParams(query).toString();
    res.redirect(`${auth_url}?${queryString}`);
  }),
  googleCallback: handleErrorAsync(async (req, res, next) => {
    const code = req.query.code;
    const options = {
      code,
      clientId: google_client_id,
      clientSecret: google_client_secret,
      redirectUri: google_redirect_url,
      grant_type: 'authorization_code',
    };
    const url = 'https://oauth2.googleapis.com/token';
    const queryString = new URLSearchParams(options).toString();
    const response = await axios.post(url, queryString);

    const { id_token, access_token } = response.data;

    const getData = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      },
    );
    const googleEmail = getData.data.email;
    const googleId = getData.data.id;
    const user = await User.findOne({
      $or: [{ googleId: googleId }, { email: googleEmail }],
    }).exec();
    if (!user) {
      const data = {
        name: getData.data.name,
        password: randomPassword(),
        googleId: getData.data.id,
        email: getData.data.email,
        avatar: getData.data.picture,
      };
      const userData = await User.create(data);
      const token = generateToken(userData);
      return successHandle(res, '已成功已登入', { token, userData });
    }
    const token = generateToken(user);
    return successHandle(res, '已成功已登入', { token, user });
  }),
  loginWithFacebook: handleErrorAsync(async (req, res, next) => {
    const query = {
      redirect_uri: facebook_redirect_url,
      client_id: facebook_client_id,
      scope: ['public_profile', 'email'],
    };
    const auth_url = 'https://www.facebook.com/v2.10/dialog/oauth';
    const queryString = new URLSearchParams(query).toString();
    res.redirect(`${auth_url}?${queryString}`);
  }),
  facebookCallback: handleErrorAsync(async (req, res, next) => {
    const code = req.query.code;
    const options = {
      code,
      client_id: facebook_client_id,
      client_secret: facebook_client_secret,
      redirect_uri: facebook_redirect_url,
    };
    const url = 'https://graph.facebook.com/v2.10/oauth/access_token';
    const queryString = new URLSearchParams(options).toString();
    const response = await axios.post(url, queryString);

    const { access_token } = response.data;

    const query = {
      fields: ['id', 'email', 'name', 'picture'].join(','),
      access_token,
    };
    const params = new URLSearchParams(query).toString();
    const getData = await axios.get(`https://graph.facebook.com/me?${params}`);
    const facebookId = getData.data.id;
    const facebookEmail = getData.data.email;
    const user = await User.findOne({
      $or: [{ facebookId: facebookId }, { email: facebookEmail }],
    }).exec();
    if (!user) {
      const data = {
        name: getData.data.name,
        password: randomPassword(),
        facebookId: getData.data.id,
        email: getData.data.email || createEmail(),
        avatar: getData.data.picture.url,
      };
      const userData = await User.create(data);
      const token = generateToken(userData);
      return successHandle(res, '已成功已登入', { token, userData });
    }
    const token = generateToken(user);
    return successHandle(res, '已成功已登入', { token, user });
  }),
  loginWithLine: handleErrorAsync(async (req, res, next) => {
    const query = {
      response_type: 'code',
      client_id: line_channel_id,
      redirect_uri: line_redirect_url,
      state: line_state,
      scope: 'profile openid email',
      nonce: uuidv4(),
    };
    const auth_url = 'https://access.line.me/oauth2/v2.1/authorize';
    const queryString = new URLSearchParams(query).toString();
    res.redirect(`${auth_url}?${queryString}`);
  }),
  lineCallback: handleErrorAsync(async (req, res, next) => {
    const code = req.query.code;
    const options = {
      code,
      client_id: line_channel_id,
      client_secret: line_channel_secret,
      redirect_uri: line_redirect_url,
      state: line_state,
      grant_type: 'authorization_code',
    };
    const url = 'https://api.line.me/oauth2/v2.1/token';
    const queryString = new URLSearchParams(options).toString();
    const response = await axios.post(url, queryString, {
      headers: tokenHeader,
    });

    const { access_token, id_token } = response.data;

    const getData = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const verifyBody = {
      id_token,
      client_id: line_channel_id,
    };

    const verifyBodyString = new URLSearchParams(verifyBody).toString();

    const getVerifyData = await axios.post(
      'https://api.line.me/oauth2/v2.1/verify',
      verifyBodyString,
      {
        headers: tokenHeader,
      },
    );
    const lineId = getData.data.userId;
    const lineEmail = getVerifyData.data.email;

    const user = await User.findOne({
      $or: [{ lineId: lineId }, { email: lineEmail }],
    }).exec();

    if (!user) {
      const data = {
        email: lineEmail || createEmail(),
        name: getVerifyData.data.displayName,
        lineId: getData.data.userId,
        avatar: getData.data.pictureUrl,
        password: randomPassword(),
      };
      const userData = await User.create(data);
      const token = generateToken(userData);
      return successHandle(res, '已成功已登入', { token, userData });
    }
    const token = generateToken(user);
    return successHandle(res, '已成功已登入', { token, user });
  }),
  loginWithDiscord: handleErrorAsync(async (req, res, next) => {
    const query = {
      client_id: discord_client_id,
      redirect_uri: discord_redirect_url,
      response_type: 'code',
      state: discord_state,
      scope: ['email', 'identify'].join(' '),
    };
    const auth_url = 'https://discord.com/api/oauth2/authorize';
    const queryString = new URLSearchParams(query).toString();
    res.redirect(`${auth_url}?${queryString}`);
  }),
  discordCallback: handleErrorAsync(async (req, res, next) => {
    const code = req.query.code;
    const options = new URLSearchParams({
      code,
      client_id: discord_client_id,
      client_secret: discord_client_secret,
      redirect_uri: discord_redirect_url,
      grant_type: 'authorization_code',
      scope: 'email identify',
    });
    const url = 'https://discord.com/api/oauth2/token';

    const response = await axios.post(url, options);

    const { access_token } = response.data;

    const { data: getData } = await axios.get('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const discordId = getData.id;
    const discordEmail = getData.email;

    const user = await User.findOne({
      $or: [{ discordId: discordId }, { email: discordEmail }],
    }).exec();

    if (!user) {
      const data = {
        email: discordEmail || createEmail(),
        name: getData.username,
        discordId,
        avatar: `https://cdn.discordapp.com/avatars/${discordId}/${getData.avatar}`,
        password: randomPassword(),
      };
      const userData = await User.create(data);
      const token = generateToken(userData);
      return successHandle(res, '已成功已登入', { token, userData });
    }
    const token = generateToken(user);
    return successHandle(res, '已成功已登入', { token, user });
  }),
};

module.exports = thirdPartyController;
