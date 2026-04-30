const mysql = require('mysql2');

const db = mysql.createConnection({
 host: 'localhost',
 user: 'root',
 password: 'TsyG@1604',
 database: 'iam_db'
});

db.connect((err)=>{
 if(err){
   console.log('Database Connection Error:', err);
 }else{
   console.log('Database Connected');
 }
});

module.exports = db;

