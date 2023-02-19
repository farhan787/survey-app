const jwt = require('jsonwebtoken');

const fakeUserId = 12;

const Authenticate = async ({ userName, password }) => {
  const payload = { userId: fakeUserId, userName };
  const privateKey =
    process.env.TOKEN_SIGNING_PRIVATE_KEY || 'fakePrivateKeyToSignJWT';

  const token = jwt.sign(payload, privateKey, { expiresIn: '30mins' });

  return { token };
};

module.exports = { Authenticate };
