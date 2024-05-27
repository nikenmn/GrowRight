const JWT = require('jsonwebtoken');
const db = require('./dbConfig');
require('dotenv').config();

const secret = process.env.JWT_SECRET;

const registerUser = async (request, h) => {
  const { userName, email, password } = request.payload;

  const newUser = {
    userName,
    email,
    password,
  };

  // Email Validation
  const emailValidation = (str) => {
    const regex = /^\S+@\S+\.\S+$/;
    return regex.test(str);
  };
  if (!emailValidation(email)) {
    const response = h.response({
      status: 'fail',
      message: 'Email must be valid',
    });
    response.code(400);
    return response;
  }

  // Password Validation
  const containsSymbolAndNumber = (str) => {
    const regex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[0-9])/;
    return regex.test(str);
  };

  const passwordLengthValidation = (str) => {
    const hasil = str.length >= 8;
    return hasil;
  };

  if (!passwordLengthValidation(password)) {
    const response = h.response({
      status: 'fail',
      message: 'Password must be at least 8 characters',
    });
    response.code(400);
    return response;
  }
  if (!containsSymbolAndNumber(password)) {
    const response = h.response({
      status: 'fail',
      message: 'Password must contain at least one symbol and one number',
    });
    response.code(400);
    return response;
  }

  // isEmailExists
  const isEmailExists = async (str) => {
    try {
      const query = 'SELECT email FROM users WHERE email = ?';
      const [rows] = await db.query(query, [str]);
      return rows.length > 0;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const createAccount = async (obj) => {
    const query = 'INSERT INTO users SET ?';
    await db.query(query, obj);
    return true;
  };

  if (await isEmailExists(email)) {
    const response = h.response({
      status: 'fail',
      message: 'Email already exists',
    });
    response.code(400);
    return response;
  }

  const token = await JWT.sign(email, secret); // synchronous

  await createAccount(newUser);
  const response = h.response({
    status: 'success',
    message: 'User created successfully',
    user: {
      userName,
      email,
    },
    token: `${token}`,
  });
  response.code(201);
  return response;
};

const homePage = (request, h) => {
  const response = h.response({
    status: 'success',
    message: 'You used a Valid JWT Token to access',
  });
  response.headers('Authorization', request.headers.authorization);
  response.code(200);
  return response;
};

const dbConnection = () => {
};

module.exports = {
  secret,
  registerUser,
  homePage,
  dbConnection,
};
