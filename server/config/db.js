const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect.then(() => console.log("✅ MSSQL Connected")).catch(err => console.error("❌ DB Connection Error:", err));

module.exports = {
  sql,
  poolConnect,
  pool, 
  config
};
