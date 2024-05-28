const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');

// inport
const signToken = require('../controller/authController');
const users = require('./users');

const registerUser = async (request, h) => {
  const { userName, email, password } = request.payload;

  const id = nanoid(6);

  const user = {
    id,
    userName,
    email,
    password,
  };

  users.push(user);

  const response = h.response({
    status: 'success',
    message: 'User has been registered',
  });
  response.code(201);
  return response;
};

const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  const isUser = users.find((user) => user.email === email);

  if (!isUser) {
    const response = h.response({
      status: 'fail',
      message: 'User not found',
    });
    response.code(404);
    return response;
  }

  if (isUser.password !== password) {
    const response = h.response({
      status: 'fail',
      message: 'Wrong password',
    });
    response.code(401);
    return response;
  }

  const token = signToken(isUser.id);
  const response = h.response({
    status: 'success',
    message: 'Login success',
    data: {
      id: isUser.id,
      userName: isUser.userName,
      email: isUser.email,
    },
    token,
  });
  response.code(200);
  return response;
};

const getUser = async (request, h) => ({
  text: 'You have accessed a protected route',
  user: request.auth.credentials,
});

module.exports = {
  registerUser,
  loginHandler,
  getUser,
};
