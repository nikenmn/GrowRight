const connection = require('./dbConfig');

const createUser = (request, h) => {
  const { userName, email, password } = request.payload;

  const newUser = {
    userName,
    email,
    password,
  };

  const query = 'INSERT INTO users SET ?';
  // Eksekusi query dengan data yang disiapkan
  connection.query(query, newUser, (error) => {
    if (error) {
      const response = h.response({
        status: 'fail',
        message: `Error during insertion NewUser: ${error}`,
      });
      response.code(500);
      return response;
    }
    const response = h.response({
      status: 'success',
      message: 'User inserted successfully',
    });
    response.code(201);
    return response;
  });
  return h.response(newUser).code(201);
};

const homePage = () => ({
  status: 'success',
});

const dbConnection = () => {
};

module.exports = {
  createUser,
  homePage,
  dbConnection,
};
