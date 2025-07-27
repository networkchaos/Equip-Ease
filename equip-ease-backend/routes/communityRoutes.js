const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllPosts,
  createPost,
} = require('../controllers/communityController');

router.get('/posts', getAllPosts); // Public
router.post('/posts', authMiddleware, createPost); // Protected

module.exports = router;
