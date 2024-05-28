const Hapi = require('@hapi/hapi');
const HapiAuthJWT2 = require('hapi-auth-jwt2');
require('dotenv').config();

// Import
const routes = require('./routes');
const InputError = require('../exceptions/InputError');

(async () => {
  const server = Hapi.server({
    port: 3000,
    // host: '0.0.0.0',
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(HapiAuthJWT2);

  const validate = async (decoded, request, h) => ({ isValid: true });

  server.auth.strategy('jwt', 'jwt', {
    key: process.env.JWT_SECRET,
    validate,
    verifyOptions: {
      algorithms: ['HS256'],
    },
  });
  server.auth.default('jwt');

  server.route(routes);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof InputError) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
      return newResponse;
    }

    if (response.isBoom) {
      const newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.output.statusCode);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server start at: ${server.info.uri}`);
})();
