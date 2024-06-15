const initializeDb = require('../config/database');

const createPrediction = async (
  userId,
  name,
  gender,
  age,
  height,
  weight,
  zsWeightAge,
  zsHeightAge,
  zsWeightHeight,
  zsTotal3,
  zsTotalPercentage,
) => {
  const db = await initializeDb();
  const [result] = await db.query(
    'INSERT INTO predictions (userId, name, gender, age, height, weight, zsWeightAge, zsHeightAge, zsWeightHeight, zsTotal3, zsTotalPercentage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [
      userId,
      name, gender, age, height, weight,
      zsWeightAge, zsHeightAge, zsWeightHeight, zsTotal3, zsTotalPercentage],
  );
  return result;
};

module.exports = {
  createPrediction,
};
