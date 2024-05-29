const bcrypt = require('bcrypt');

const containsSymbolAndNumber = (str) => {
  const regex = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])(?=.*[0-9])/;
  return regex.test(str);
};

const passwordLengthValidation = (str) => {
  const result = str.length >= 8;
  return result;
};

// Fungsi untuk memverifikasi kata sandi pengguna
const isValidPassword = async (plaintextPassword, hash) => {
  const result = await bcrypt.compare(plaintextPassword, hash);
  return result;
};

module.exports = {
  containsSymbolAndNumber,
  passwordLengthValidation,
  isValidPassword,
};
