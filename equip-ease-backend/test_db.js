// test_db.js

const pool = require('./config/db');

async function testConnection() {
  try {
    // Simple test query
    const result = await pool.query('SELECT NOW() AS time');
    console.log('✅ Database connected!');
    console.log('Current DB time:', result.rows[0].time);
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}

testConnection();
