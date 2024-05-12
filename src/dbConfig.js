require('dotenv').config();
const MySQL = require('mysql2');

const db = MySQL.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const cekDbConnection = () => {
  db.connect((err) => {
    if (err) {
      console.log(`error DB connecting: ${err.stack}`);
      throw err;
    }
    console.log(`DB is connected as id ${db.threadId}`);
  });
};

cekDbConnection();

module.exports = db;
