const bcrypt = require('bcrypt');
const initializeDb = require('../config/database');

const saltRounds = 10;

// Fungsi untuk membuat pengguna baru
const createUser = async (userId, userName, email, password) => {
  const db = await initializeDb();
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const [result] = await db.query(
    'INSERT INTO users (userId, username, email, password) VALUES (?, ?, ?, ?)',
    [userId, userName, email, hashedPassword],
  );
  return result;
};
// const updateUser = async (userId, userName, email, noHp) => {
//   const [result] = await db.query(
//     'UPDATE users SET username = ?, email = ?, noHp = ? WHERE userId = ?',
//     [userName, email, noHp, userId],
//   );
//   return result;
// };
const updateUser = async (userId, userName, email, noHp) => {
  const db = await initializeDb();
  let query = 'UPDATE users SET ';
  const params = [];

  if (userName) {
    query += 'userName = ?, ';
    params.push(userName);
  }
  if (email) {
    query += 'email = ?, ';
    params.push(email);
  }
  if (noHp) {
    query += 'noHp = ?, ';
    params.push(noHp);
  }

  // Hapus koma terakhir dan tambahkan WHERE clause
  // query = query.slice(0, -2) + ' WHERE userId = ?';
  query = `${query.slice(0, -2)} WHERE userId = ?`;
  params.push(userId);

  // Eksekusi query
  const [result] = await db.query(query, params);
  return result;
};

const getUserByEmail = async (email) => {
  const db = await initializeDb();
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};
const getUserById = async (userId) => {
  const db = await initializeDb();
  const [rows] = await db.query('SELECT * FROM users WHERE userId = ?', [userId]);
  return rows[0];
};

const isEmailExists = async (str) => {
  const db = await initializeDb();
  const query = 'SELECT email FROM users WHERE email = ?';
  const [rows] = await db.query(query, [str]);
  return rows.length > 0;
};

module.exports = {
  createUser,
  updateUser,
  getUserByEmail,
  getUserById,
  isEmailExists,
};
