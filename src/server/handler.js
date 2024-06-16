const { nanoid } = require('nanoid');
const axios = require('axios');

// inport
const signToken = require('../controller/authController');
const {
  calculateBMI, classifyBMI, classifyWeightStatus, conclusionClassify,
} = require('../controller/predictDecriptionController');
const emailValidation = require('../validator/emailValidator');
const { containsSymbolAndNumber, passwordLengthValidation, isValidPassword } = require('../validator/PasswordValidator');
const { createPrediction, getPrediction } = require('../model/predictionModel');
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

const predictionHandler = async (request, h) => {
  const { credentials } = request.auth;
  const { userId } = request.params;
  const {
    name,
    gender,
    age,
    height,
    weight,
  } = request.payload;

  if (credentials.userId !== userId) {
    const response = h.response({
      status: 'fail',
      message: 'Unauthorized',
    });
    response.code(401);
    return response;
  }

  if (!name || !age || !height || !weight) {
    const response = h.response({
      status: 'fail',
      message: 'Missing required field',
    });
    response.code(400);
    return response;
  }

  if (gender !== 1 && gender !== 0) {
    const response = h.response({
      status: 'fail',
      message: 'Gender most be 1 or 0',
    });
    response.code(400);
    return response;
  }

  const data = {
    gender,
    age,
    weight,
    height,
  };

  const options = {
    url: 'http://34.101.116.202:8080/predict',
    headers: {
      'Content-Type': 'application/json',
      apikey: 'B1sM1Llaht0pi5C4p5t0N3',
    },
  };

  const apiResponse = await axios.post(options.url, data, {
    headers: options.headers,
  });

  const prediction = apiResponse.data.formatted_predictions;
  const zsWeightAge = parseFloat(prediction[0]);
  const zsHeightAge = parseFloat(prediction[1]);
  const zsWeightHeight = parseFloat(prediction[2]);
  const zsTotal3 = parseFloat(prediction[3]);
  const zsTotalPercentage = parseFloat(prediction[4]);

  // Menyimpan input dan hasil prediksi ke database
  await createPrediction(
    userId,
    name,
    gender,
    age,
    height,
    weight,
    zsWeightAge,
    zsHeightAge,
    zsWeightHeight,
    zsTotal3,
    zsTotalPercentage,
  );

  const response = h.response({
    status: 'success',
    message: 'Prediction success',
    data: {
      input: {
        name,
        ...data,
      },
      prediction: {
        zsWeightAge,
        zsHeightAge,
        zsWeightHeight,
        zsTotal: zsTotal3,
        zsTotalPercentage,
      },
      description: {
        weightAge: classifyWeightStatus(zsWeightAge),
        heightAge: classifyBMI(zsHeightAge),
        weightHeight: calculateBMI(zsWeightHeight),
        conclusion: conclusionClassify(zsTotal3),
      },
    },
  });
  response.code(200);
  return response;
};

const predictionHistoryHandler = async (request, h) => {
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

  const history = await getPrediction(userId);

  // if (!history || history.length === 0) {
  //   const response = h.response({
  //     status: 'No Content',
  //   });
  //   response.code(204); // 204 No Content
  //   return response;
  // }

  const processedHistory = history.map((item) => ({
    id: item.id,
    input: {
      name: item.name,
      gender: item.gender,
      age: item.age,
      weight: item.weight,
      height: item.height,
    },
    prediction: {
      zsWeightAge: item.zsWeightAge,
      zsHeightAge: item.zsHeightAge,
      zsWeightHeight: item.zsWeightHeight,
      zsTotal: item.zsTotal3,
      zsTotalPercentage: item.zsTotalPercentage,
    },
    createDat: item.createDat,
  }));

  const response = h.response({
    status: 'success',
    data: processedHistory,
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
  predictionHandler,
  predictionHistoryHandler,
};
