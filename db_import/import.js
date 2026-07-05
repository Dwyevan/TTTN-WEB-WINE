const fs = require('fs');
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'hayabusa.proxy.rlwy.net',
  port: 37121,
  user: 'root',
  password: 'cRPbkEjlyVUynKosUyWCIuHzsRLPJRTy',
  database: 'railway',
  multipleStatements: true
});

const sql = fs.readFileSync('../wine_store_db.sql', 'utf8');

connection.connect((err) => {
  if (err) {
    console.error('Error connecting:', err);
    process.exit(1);
  }
  console.log('Connected to Railway. Importing data...');
  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Error importing:', error);
      process.exit(1);
    }
    console.log('Import complete successfully!');
    connection.end();
  });
});
