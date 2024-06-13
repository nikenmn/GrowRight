const Hapi = require('@hapi/hapi');
const Bell = require('@hapi/bell');
const HapiAuthJWT2 = require('hapi-auth-jwt2');
require('dotenv').config();

// Import
const routes = require('./routes');
const InputError = require('../exceptions/InputError');

(async () => {
  const server = Hapi.server({
    port: 3000,
    host: process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([Bell, HapiAuthJWT2]);

  // Menetapkan strategi otentikasi menggunakan Bell dengan penyedia Google
  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: process.env.COOKIE_ENCRYPTION_PASSWORD,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    isSecure: false,
    // isSecure: process.env.NODE_ENV !== 'production',
  });

  const validate = async () => ({ isValid: true });

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
