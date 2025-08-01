const db = require('../config/db');

const createBooking = async (req, res) => {
  try {
    const { equipment_id, start_date, end_date } = req.body;
    const user_id = req.user.id;

    if (!equipment_id || !start_date || !end_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Fetch equipment price
    const equipmentRes = await db.query(
      'SELECT equipment_price_per_day FROM equipment WHERE equipment_equipment_id = $1',
      [equipment_id]
    );

    if (equipmentRes.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }

    const pricePerDay = parseFloat(equipmentRes.rows[0].equipment_price_per_day);
    const days = Math.ceil((new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24));
    const totalAmount = days * pricePerDay;

    // Insert booking
    const insertBooking = await db.query(
      `INSERT INTO bookings (
        bookings_equipment_id,
        bookings_farmer_id,
        bookings_start_date,
        bookings_end_date,
        bookings_status,
        bookings_total_amount
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [equipment_id, user_id, start_date, end_date, 'RENTED', totalAmount]
    );

    // Update equipment status
    await db.query(
      `UPDATE equipment
       SET equipment_status = 'RENTED',
           equipment_availability = 'RENTED'
       WHERE equipment_equipment_id = $1`,
      [equipment_id]
    );

    res.status(201).json({
      message: 'Booking created successfully',
      booking: insertBooking.rows[0],
    });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ message: 'Failed to create booking. Please try again.' });
  }
};

module.exports = {
  createBooking,
};
