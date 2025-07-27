const express = require('express');
const router = express.Router();
const db = require('../config/db');
const authenticate = require('../middleware/authMiddleware');

// POST a review
router.post('/', authenticate, async (req, res) => {
  const { equipmentId, comment, rating } = req.body;
  const userId = req.user.user_id;

  try {
    // Get a related booking for review
    const bookingRes = await db.query(
      `SELECT Bookings_booking_id FROM Bookings
       WHERE Bookings_equipment_id = $1 AND Bookings_farmer_id = $2
       ORDER BY Bookings_start_date DESC LIMIT 1`,
      [equipmentId, userId]
    );

    if (bookingRes.rows.length === 0) {
      return res.status(400).json({ message: 'No booking found to review.' });
    }

    const bookingId = bookingRes.rows[0].bookings_booking_id;

    const reviewRes = await db.query(
      `INSERT INTO Reviews (Reviews_booking_id, Reviews_rating, Reviews_comment)
       VALUES ($1, $2, $3) RETURNING *`,
      [bookingId, rating, comment]
    );

    res.status(201).json({ ...reviewRes.rows[0], username: req.user.email });
  } catch (err) {
    console.error('Error adding review:', err);
    res.status(500).json({ message: 'Failed to add review' });
  }
});

// GET reviews for a specific equipment
router.get('/equipment/:id', async (req, res) => {
  const equipmentId = req.params.id;

  try {
    const result = await db.query(
      `SELECT r.*, u.Users_name AS username
       FROM Reviews r
       JOIN Bookings b ON r.Reviews_booking_id = b.Bookings_booking_id
       JOIN Users u ON b.Bookings_farmer_id = u.Users_user_id
       WHERE b.Bookings_equipment_id = $1
       ORDER BY r.Reviews_date DESC`,
      [equipmentId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Failed to get reviews:', err);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

module.exports = router;
