const { nanoid } = require('nanoid');

// inport
const signToken = require('../controller/authController');
const emailValidation = require('../validator/emailValidator');
const { containsSymbolAndNumber, passwordLengthValidation, isValidPassword } = require('../validator/PasswordValidator');
const {
  createUser,
  updateUser,
  getUserByEmail,
  getUserById,
  isEmailExists,
} = require('../model/userModel');

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

  await createUser(userId, userName, email, password);

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

  const token = signToken(isUser.userId, isUser.email);
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

const loginGoogleHandler = async (request, h) => {
  if (!request.auth.isAuthenticated) {
    return `Authentication failed due to: ${request.auth.error.message}`;
  }

  // Mendapatkan informasi profil pengguna dari Google
  const { profile } = request.auth.credentials;

  // Mengecek apakah pengguna sudah terdaftar
  const isUser = await getUserByEmail(profile.email);

  if (!isUser) {
    const userId = nanoid(6);
    // Memasukkan informasi profil pengguna ke dalam database
    await createUser(userId, profile.displayName, profile.email, '');

    const token = signToken(userId, profile.email);

    const response = h.response({
      status: 'success',
      message: 'User has been registered',
      data: {
        userId,
        userName: profile.displayName,
        email: profile.email,
      },
      token,
    });
    response.code(201);
    return response;
  }

  const token = signToken(isUser.userId, isUser.email);
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
  const { credentials } = request.auth;

  const { userId, userName, email } = await getUserByEmail(credentials.email);

  const response = h.response({
    status: 'success',
    data: {
      userId,
      userName,
      email,
    },
  });
  response.code(200);
  return response;
};

const getUserProfile = async (request, h) => {
  const { credentials } = request.auth;
  const { userId } = request.params;

  if (credentials.userId !== userId) {
    const response = h.response({
      status: 'fail',
      message: 'Unauthorized',
    });
    response.code(401);
    return response;
  }

  const user = await getUserById(userId);

  const response = h.response({
    status: 'success',
    data: {
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      noHp: user.noHp,
      createDat: user.createDat,
      updateDat: user.updateDat,
    },
  });
  response.code(200);
  return response;
};

const editUserProfile = async (request, h) => {
  const { credentials } = request.auth;
  const { userId } = request.params;
  const { userName, email, noHp } = request.payload;

  if (credentials.userId !== userId) {
    const response = h.response({
      status: 'fail',
      message: 'Unauthorized',
    });
    response.code(401);
    return response;
  }

  if (email !== '') {
    if (!emailValidation(email)) {
      const response = h.response({
        status: 'fail',
        message: 'Invalid email',
      });
      response.code(400);
      return response;
    }
  }

  if (await isEmailExists(email)) {
    const response = h.response({
      status: 'fail',
      message: 'Email already registered',
    });
    response.code(400);
    return response;
  }

  await updateUser(userId, userName, email, noHp);
  const user = await getUserById(userId);

  const response = h.response({
    status: 'success',
    message: 'User has been updated',
    data: {
      userId: user.userId,
      userName: user.userName,
      email: user.email,
      noHp: user.noHp,
      createDat: user.createDat,
      updateDat: user.updateDat,
    },
  });
  response.code(200);
  return response;
};

module.exports = {
  registerUser,
  loginHandler,
  loginGoogleHandler,
  getUser,
  getUserProfile,
  editUserProfile,
};
