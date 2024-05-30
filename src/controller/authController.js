const jwt = require('jsonwebtoken');

const signToken = (userId, email) => jwt.sign({ userId, email }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

module.exports = signToken;
