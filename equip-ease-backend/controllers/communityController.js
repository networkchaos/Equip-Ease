const db = require('../config/db');

const getAllPosts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT cp.CommunityPosts_post_id AS id,
             cp.CommunityPosts_content AS content,
             cp.CommunityPosts_created_at AS created_at,
             u.Users_name AS username
      FROM CommunityPosts cp
      JOIN Users u ON cp.CommunityPosts_user_id = u.Users_user_id
      ORDER BY cp.CommunityPosts_created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching posts:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const createPost = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id; // From JWT

  if (!content) return res.status(400).json({ message: 'Content is required' });

  try {
    const result = await db.query(
      `INSERT INTO CommunityPosts (CommunityPosts_user_id, CommunityPosts_content)
       VALUES ($1, $2) RETURNING *`,
      [userId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('❌ Error creating post:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllPosts, createPost };
