const mysql = require('mysql2');

require('dotenv').config();
 
const connection  = mysql.createConnection({
    host : process.env.DB_HOST,
    port: process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE,
      ssl: {
        rejectUnauthorized: false
    }
})

connection.connect((err) => {
    if(err) {
        console.log('Error connecting to the database:', err);

    } else {
        console.log('Connected to the database');
    }
})

module.exports = connection;