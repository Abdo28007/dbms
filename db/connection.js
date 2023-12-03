
const mysql = require('mysql2')


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'seraiche_abderrahmen',
    password: 'ABDO20032020@abdo20032020',
    database: 'university_db',
  });
  
connection.connect((err) => {
    if (err) {
      console.error('Erreur de connexion à MySQL:', err);
    } else {
      console.log('Connecté à MySQL!');
    }
});
module.exports = connection
