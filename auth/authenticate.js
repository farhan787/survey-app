const jwt = require('jsonwebtoken');

const authenticateUser = ({ accessToken }) => {
  if (!accessToken) {
    throw new Error('Access token is invalid or missing');
  }

  const privateKey =
    process.env.TOKEN_SIGNING_PRIVATE_KEY || 'fakePrivateKeyToSignJWT';
  const { userName, userId } = jwt.verify(accessToken, privateKey);

  return {
    userName,
    userId,
  };
};

module.exports = { authenticateUser };
