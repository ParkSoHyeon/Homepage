const mysql  = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
	  connectionLimit: process.env.DB_CONNECTION_LIMIT
});

console.info('DB_HOST :', process.env.DB_HOST);
console.info('DB_DATABASE :', process.env.DB_DATABASE);

module.exports = connection ;
