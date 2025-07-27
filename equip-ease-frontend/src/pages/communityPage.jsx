import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getUser } from '../services/auth';

function CommunityPage() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = getUser();
    setUser(userData);
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/posts');
      setPosts(response.data);
    } catch (error) {
      console.error('❌ Error fetching posts:', error.message);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      alert('Please log in to post');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5001/api/posts',
        { content },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setContent('');
      fetchPosts();
    } catch (error) {
      console.error('❌ Error posting:', error.message);
      alert('Failed to post');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Community Forum</h2>

      {user ? (
        <form onSubmit={handlePostSubmit} className="mb-4">
          <div className="form-group">
            <textarea
              className="form-control"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              required
            />
          </div>
          <button className="btn btn-primary mt-2" type="submit">
            Post
          </button>
        </form>
      ) : (
        <div className="alert alert-info">
          <strong>Note:</strong> Log in to post in the community.
        </div>
      )}

      <div className="post-list">
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="card mb-3">
              <div className="card-body">
                <p>{post.content}</p>
                <small className="text-muted">
                  Posted by <strong>{post.username || 'Unknown User'}</strong>
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CommunityPage;
