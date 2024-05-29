const { nanoid } = require('nanoid');

// inport
const signToken = require('../controller/authController');
const emailValidation = require('../validator/emailValidator');
const { containsSymbolAndNumber, passwordLengthValidation, isValidPassword } = require('../validator/PasswordValidator');
const { createUser, getUserByEmail, isEmailExists } = require('../model/userModel');

const registerUser = async (request, h) => {
  const { userName, email, password } = request.payload;

  if (!emailValidation(email)) {
    const response = h.response({
      status: 'fail',
      message: 'Invalid email',
    });
    response.code(400);
    return response;
  }

  if (!passwordLengthValidation(password)) {
    const response = h.response({
      status: 'fail',
      message: 'Password must be at least 8 characters long',
    });
    response.code(400);
    return response;
  }

  if (!containsSymbolAndNumber(password)) {
    const response = h.response({
      status: 'fail',
      message: 'Password must contain at least one symbol and number',
    });
    response.code(400);
    return response;
  }

  if (await isEmailExists(email)) {
    const response = h.response({
      status: 'fail',
      message: 'Email already registered',
    });
    response.code(400);
    return response;
  }

  const userId = nanoid(6);

  createUser(userId, userName, email, password);

  const response = h.response({
    status: 'success',
    message: 'User has been registered',
  });
  response.code(201);
  return response;
};

const loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  const isUser = await getUserByEmail(email);

  if (!isUser) {
    const response = h.response({
      status: 'fail',
      message: 'User not found',
    });
    response.code(404);
    return response;
  }

  if (await isValidPassword(password, isUser.password) === false) {
    const response = h.response({
      status: 'fail',
      message: 'Wrong password',
    });
    response.code(401);
    return response;
  }

  const token = signToken(isUser.email);
  const response = h.response({
    status: 'success',
    message: 'Login success',
    data: {
      userId: isUser.userId,
      userName: isUser.userName,
      email: isUser.email,
    },
    token,
  });
  response.code(200);
  return response;
};

const getUser = async (request, h) => {
  // disini bermasalah
  const { u } = request.auth.credentials;

  const user = getUserByEmail(u);

  const response = h.response({
    status: 'success',
    data: {
      user,
    },
  });
  response.code(200);
  return response;
};

module.exports = {
  registerUser,
  loginHandler,
  getUser,
};
