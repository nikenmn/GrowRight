require('dotenv').config();
const MySQL = require('mysql2/promise');

const db = MySQL.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const cekDbConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('DB is connected');
    connection.release(); // Melepaskan koneksi kembali ke pool
  } catch (err) {
    console.error('Error connecting to the database:', err.stack);
  }
};

cekDbConnection();

module.exports = db;
