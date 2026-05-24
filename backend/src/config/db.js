const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool (reuses connections efficiently)
const pool = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'cricket_ai',
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
});

// Test the connection on startup
async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    console.error('   Check your .env DB_HOST, DB_USER, DB_PASSWORD, DB_NAME');
    process.exit(1);
  }
}

module.exports = { pool, testConnection };
