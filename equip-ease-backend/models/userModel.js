const db = require('../config/db');

const createUser = async (name, email, password, role) => {
  const result = await db.query(
    'INSERT INTO Users (Users_name, Users_email, Users_password, Users_role) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, password, role]
  );
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await db.query('SELECT * FROM Users WHERE Users_email = $1', [email]);
  return result.rows[0];
};

module.exports = { createUser, getUserByEmail };
