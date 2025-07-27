const pool = require('../config/db');

exports.createComment = async (req, res) => {
  const { post_id, user_id, content } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO comments (post_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [post_id, user_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating comment' });
  }
};
