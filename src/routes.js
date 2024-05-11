const {
  createUser,
  homePage,
  dbConnection,
} = require('./handler');

const routes = [
  {
    method: 'GET',
    path: '/',
    handler: homePage,
  },
  {
    method: 'POST',
    path: '/users',
    handler: createUser,
  },
  {
    // Bermasalah
    method: 'GET',
    path: '/users',
    handler: dbConnection,
  },
];

module.exports = routes;
