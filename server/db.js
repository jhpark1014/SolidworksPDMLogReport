import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();

// mssql connection
const sqlConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSOWRD,
  database: process.env.DB_DATEBASE,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: false // change to true for local dev / self-signed certs
  }
}


const db = new sql.ConnectionPool(sqlConfig)
  .connect()
  .then((pool) => {
    console.log('DB연결 성공');
    return pool;
  })
  .catch((err) => {
    console.log('err ', err);
  });

export {
  sql,
  db
}

