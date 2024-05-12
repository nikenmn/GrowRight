const db = require('./dbConfig');

const registerUser = async (request, h) => {
  try {
    const { userName, email, password } = request.payload;

    const newUser = {
      userName,
      email,
      password,
    };

    // Email Validation
    const emailValidation = (str) => {
      const regex = /^\S+@\S+\.\S+$/;
      return regex.test(str);
    };
    if (!emailValidation(email)) {
      const response = h.response({
        status: 'fail',
        message: 'Email must be valid',
      });
      response.code(400);
      return response;
    }

    // Password Validation
    const containsSymbolAndNumber = (str) => {
      const regex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[0-9])/;
      return regex.test(str);
    };

    const passwordLengthValidation = (str) => {
      const hasil = str.length >= 8;
      return hasil;
    };

    if (!passwordLengthValidation(password)) {
      const response = h.response({
        status: 'fail',
        message: 'Password must be at least 8 characters',
      });
      response.code(400);
      return response;
    }
    if (!containsSymbolAndNumber(password)) {
      const response = h.response({
        status: 'fail',
        message: 'Password must contain at least one symbol and one number',
      });
      response.code(400);
      return response;
    }

    const insertUserQuery = 'INSERT INTO users SET ?';
    db.query(insertUserQuery, newUser, (error) => {
      if (error) {
        const response = h.response({
          status: 'fail',
          message: `Error during insertion NewUser: ${error}`,
        });
        response.code(500);
        return response;
      }

      return 'success';
    });

    const response = h.response({
      status: 'success',
      message: 'User inserted successfully',
      data: {
        userName,
        email,
      },
    });
    response.code(201);
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    const response = h.response({
      status: 'error',
      message: 'Internal server error',
    });
    response.code(500);
    return response;
  }
};

const homePage = () => ({
  status: 'success',
});

const dbConnection = () => {
};

module.exports = {
  registerUser,
  homePage,
  dbConnection,
};
