const bcrypt = require('bcrypt');
const db = require('../config/database');

const saltRounds = 10;

// Fungsi untuk membuat pengguna baru
const createUser = async (userId, userName, email, password) => {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const [result] = await db.query(
    'INSERT INTO users (userId, username, email, password) VALUES (?, ?, ?, ?)',
    [userId, userName, email, hashedPassword],
  );
  return result;
};

const getUserByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const isEmailExists = async (str) => {
  const query = 'SELECT email FROM users WHERE email = ?';
  const [rows] = await db.query(query, [str]);
  return rows.length > 0;
};

module.exports = {
  createUser,
  getUserByEmail,
  isEmailExists,
};
