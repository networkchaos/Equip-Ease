const express = require('express');
const { register, login, sendResetToken, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', sendResetToken);
router.post('/reset-password/:token', resetPassword);




module.exports = router;
