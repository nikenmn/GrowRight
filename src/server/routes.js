const {
  registerUser,
  loginHandler,
  getUser,
  getUserProfile,
  editUserProfile,
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
];

module.exports = routes;
