const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// GET all equipment
// ✅ Route for fetching all equipment (public)
router.get('/all', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM equipment');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ Route for fetching a single equipment by ID (must come **after** /all)
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid equipment ID' });

  try {
    const result = await pool.query('SELECT * FROM equipment WHERE equipment_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Equipment not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching equipment by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
