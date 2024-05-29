const jwt = require('jsonwebtoken');

const signToken = (email) => jwt.sign({ email }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRES_IN,
});

module.exports = signToken;
