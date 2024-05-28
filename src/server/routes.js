const {
  registerUser,
  loginHandler,
  getUser,
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
];

module.exports = routes;
