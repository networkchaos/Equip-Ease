// models/reviewModel.js
const pool = require('../config/db');

// Fetch all reviews for a specific equipment ID
async function getReviewsByEquipmentId(equipmentId) {
  const query = `
    SELECT 
      r.Reviews_review_id, 
      r.Reviews_comment, 
      r.Reviews_rating,
      r.Reviews_date, 
      u.Users_name AS username
    FROM Reviews r
    JOIN Bookings b ON r.Reviews_booking_id = b.Bookings_booking_id
    JOIN Users u ON b.Bookings_farmer_id = u.Users_user_id
    JOIN Equipment e ON b.Bookings_equipment_id = e.Equipment_equipment_id
    WHERE e.Equipment_equipment_id = $1
    ORDER BY r.Reviews_date DESC
  `;
  const result = await pool.query(query, [equipmentId]);
  return result.rows;
}

// Check if booking belongs to user
async function isBookingOwnedByUser(bookingId, userId) {
  const query = `
    SELECT * FROM Bookings 
    WHERE Bookings_booking_id = $1 AND Bookings_farmer_id = $2
  `;
  const result = await pool.query(query, [bookingId, userId]);
  return result.rowCount > 0;
}

// Add a new review
async function addReview(bookingId, rating, comment) {
  const query = `
    INSERT INTO Reviews (Reviews_booking_id, Reviews_rating, Reviews_comment)
    VALUES ($1, $2, $3)
    RETURNING Reviews_review_id, Reviews_comment, Reviews_date
  `;
  const result = await pool.query(query, [bookingId, rating, comment]);
  return result.rows[0];
}

module.exports = {
  getReviewsByEquipmentId,
  isBookingOwnedByUser,
  addReview
};
