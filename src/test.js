const db = require('./dbConfig');

const ambilData = async () => {
  try {
    const query = 'SELECT * FROM users';
    const [rows] = await db.query(query);
    console.log(rows);
  } catch (error) {
    console.log(error);
  } finally {
    if (db) {
      await db.end();
    }
  }
};

ambilData();
