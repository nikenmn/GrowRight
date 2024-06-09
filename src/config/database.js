require('dotenv').config();
const { Connector } = require('@google-cloud/cloud-sql-connector');
const mysql = require('mysql2/promise');

// Mendefinisikan fungsi untuk menentukan tipe IP
const getIpType = () => (
  process.env.PRIVATE_IP === '1' || process.env.PRIVATE_IP === 'true'
    ? 'PRIVATE'
    : 'PUBLIC'
);

// Fungsi untuk menginisialisasi koneksi dengan Google Cloud SQL Connector
const connectWithConnector = async (config) => {
  const connector = new Connector();
  const clientOpts = await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME,
    ipType: getIpType(),
  });
  const dbConfig = {
    ...clientOpts,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ...config,
  };
  return mysql.createPool(dbConfig);
};

// Menginisialisasi koneksi ke database
const initializeDb = async () => {
  try {
    const db = await connectWithConnector({});
    return db;
  } catch (err) {
    console.error('Error initializing the database connection:', err.stack);
    throw err;
  }
};

// Memeriksa koneksi ke database
const cekDbConnection = async () => {
  const db = await initializeDb();
  try {
    const connection = await db.getConnection();
    console.log('DB is connected');
    connection.release(); // Melepaskan koneksi kembali ke pool
  } catch (err) {
    console.error('Error connecting to the database:', err.stack);
  }
};

cekDbConnection();

module.exports = initializeDb;
