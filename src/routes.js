const {
  registerUser,
  homePage,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/register',
    handler: registerUser,
  },
  {
    method: 'GET',
    path: '/',
    config: {
      auth: 'jwt',
    },
    handler: homePage,
  },
];

module.exports = routes;
