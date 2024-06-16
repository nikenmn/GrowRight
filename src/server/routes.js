const {
  registerUser,
  loginHandler,
  loginGoogleHandler,
  getUser,
  getUserProfile,
  editUserProfile,
  predictionHandler,
  predictionHistoryHandler,
} = require('./handler');

const routes = [
  {
    method: '*',
    path: '/',
    options: {
      auth: false,
    },
    handler: (request, h) => {
      const response = h.response({
        status: 'success',
        message: 'Welcome to the GrowRight API ;)',
      });
      response.code(200);
      return response;
    },
  },
  {
    method: 'POST',
    path: '/register',
    options: {
      auth: false,
    },
    handler: registerUser,
  },
  {
    method: 'POST',
    path: '/login',
    options: {
      auth: false,
    },
    handler: loginHandler,
  },
  {
    method: ['GET', 'POST'],
    path: '/login-google',
    options: {
      auth: 'google',
    },
    handler: loginGoogleHandler,
  },
  {
    method: 'GET',
    path: '/home',
    handler: getUser,
  },
  {
    method: 'GET',
    path: '/profile/{userId}',
    handler: getUserProfile,
  },
  {
    method: 'PUT',
    path: '/profile/{userId}',
    handler: editUserProfile,
  },
  {
    method: 'POST',
    path: '/prediction/{userId}',
    handler: predictionHandler,
  },
  {
    method: 'GET',
    path: '/prediction/{userId}',
    handler: predictionHistoryHandler,
  },
];

module.exports = routes;
