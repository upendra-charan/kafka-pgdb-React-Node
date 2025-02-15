require('dotenv').config();
const { Pool } = require('pg');
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>.", process.env)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: String('Upenpostgresql'),
  port: 5432,

  //     user: 'postgres',
//     host: 'localhost',
//     database:'mydatabase',
//     password: String('Upenpostgresql'),
//     port: 5432,

});

pool.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch(err => console.error('Database connection error', err));

module.exports = pool;
