const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
router.post('/', authMiddleware, createBooking); // POST /api/bookings

module.exports = router;
