const Hapi = require('@hapi/hapi');
const hapiAuthJWT = require('hapi-auth-jwt2');
const secret = require('./handler');
const routes = require('./routes');

const validate = async (people, decoded, request) => {
  console.log(' - - - - - - - decoded token:');
  console.log(decoded);
  console.log(' - - - - - - - request info:');
  console.log(request.info);
  console.log(' - - - - - - - user agent:');
  console.log(request.headers['user-agent']);

  // do your checks to see if the person is valid
  if (!people[decoded.id]) {
    return { isValid: false };
  }
  return { isValid: true };
};

const init = async () => {
  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register(hapiAuthJWT);
  server.auth.strategy('jwt', 'jwt',
    {
      key: secret,
      validate,
      verifyOptions: { ignoreExpiration: true },
    },
  );

  server.route(routes);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

init();
