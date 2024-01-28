
const mysql = require('mysql2')


const connection = mysql.createConnection({
    host: 'sql8.freesqldatabase.com',
    user: 'sql8680378',
    password: 'eEyNPA5tKb',
    database: 'sql8680378',
  }).promise()
  

module.exports = connection
