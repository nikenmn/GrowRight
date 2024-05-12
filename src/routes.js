const {
  registerUser,
  homePage,
  dbConnection,
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
    handler: homePage,
  },
  {
    // Bermasalah
    method: 'GET',
    path: '/users',
    handler: dbConnection,
  },
];

module.exports = routes;
