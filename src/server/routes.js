const {
  registerUser,
  loginHandler,
  loginGoogleHandler,
  getUser,
  getUserProfile,
  editUserProfile,
  predictionHandler,
} = require('./handler');

const routes = [
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
];

module.exports = routes;
