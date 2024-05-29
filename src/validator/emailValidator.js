const emailValidation = (str) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(str);
};

module.exports = emailValidation;
