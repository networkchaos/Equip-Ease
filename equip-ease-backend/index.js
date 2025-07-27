const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

const postsRoutes = require('./routes/posts.routes');
const commentsRoutes = require('./routes/comments.routes');

app.use(cors());
app.use(express.json());

app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
