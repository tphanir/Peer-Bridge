const mysql = require('mysql2');
require('dotenv').config(); // Load environment variables

// Create a MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'my_database',
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database');
  
  // Set collation after successful connection
  const query = `SET NAMES utf8mb4 COLLATE utf8mb4_0900_ai_ci`;
  db.query(query, (err, result) => {
    if (err) {
      console.error('Error setting collation:', err);
      return;
    }
    console.log('Collation set successfully');
  });
});


// Export the database connection for use in other files
module.exports = db;
