const pool = require('./config/db');

pool.query('SELECT NOW()')
  .then(res => {
    console.log('✅ Connected to PostgreSQL at:', res.rows[0].now);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
    process.exit(1);
  });
