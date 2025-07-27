const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail } = require('../models/userModel');
const crypto = require('crypto');
const db = require('../config/db');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  const existing = await getUserByEmail(email);
  if (existing) return res.status(400).json({ message: 'Email already in use' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await createUser(name, email, hashed, role);
  const token = jwt.sign({ id: user.users_user_id, role: user.users_role }, 'your_jwt_secret');

  res.json({ token, user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.users_password);
  if (!match) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.users_user_id, role: user.users_role }, 'your_jwt_secret');
  res.json({ token, user });
};

const sendResetToken = async (req, res) => {
  const { email } = req.body;
  const user = await getUserByEmail(email);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  const expiry = new Date(Date.now() + 30 * 60 * 1000); // 30 mins

  await db.query(
    'UPDATE Users SET reset_token = $1, reset_token_expiry = $2 WHERE users_email = $3',
    [token, expiry, email]
  );

  // Simulate sending email
  console.log(`📧 Password reset link: http://localhost:3000/reset-password/${token}`);

  res.json({ message: 'Reset link sent (check console)' });
};

const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const result = await db.query(
    'SELECT * FROM Users WHERE reset_token = $1 AND reset_token_expiry > NOW()',
    [token]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ message: 'Invalid or expired token' });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  await db.query(
    'UPDATE Users SET users_password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = $2',
    [hashed, token]
  );

  res.json({ message: 'Password updated successfully' });
};
module.exports = { register, login, sendResetToken, resetPassword };
