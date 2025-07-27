const pool = require('../config/db');

exports.createPost = async (req, res) => {
  const { user_id, content } = req.body;
  console.log('Received body:', req.body);

  try {
    const result = await pool.query(
      `INSERT INTO communityposts (user_id, content)
       VALUES ($1, $2)
       RETURNING *`,
      [user_id, content]
    );
    console.log('Insert result:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const postsResult = await pool.query(`
      SELECT p.post_id, p.user_id, p.content, p.created_at,
             u.name as user_name
      FROM communityposts p
      JOIN users u ON u.user_id = p.user_id
      ORDER BY p.created_at DESC
    `);

    const commentsResult = await pool.query(`
      SELECT c.comment_id, c.post_id, c.user_id, c.content, c.created_at,
             u.name as user_name
      FROM comments c
      JOIN users u ON u.user_id = c.user_id
      ORDER BY c.created_at ASC
    `);

    const posts = postsResult.rows;
    const comments = commentsResult.rows;

    const postsWithComments = posts.map(post => ({
      ...post,
      comments: comments.filter(c => c.post_id === post.post_id)
    }));

    res.json(postsWithComments);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching posts' });
  }
};
