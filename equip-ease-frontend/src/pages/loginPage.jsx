import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/auth';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [type, setType] = useState('');
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');
  setType('');

  try {
    const fullUser = await login(form.email, form.password); // 🔥 FIXED: No destructuring
    loginUser(fullUser); // 🔥 send full user object to context
    setType('success');
    setMessage('Login successful! Redirecting...');
    setTimeout(() => navigate('/'), 1000);
  } catch (err) {
    console.error(err);
    setType('danger');
    setMessage('Invalid email or password.');
  }
};

  return (
    <div className="login-page">
      <form id="login-form" onSubmit={handleSubmit}>
        <h2>Login to Equip Ease</h2>

        {message && <div className={`alert alert-${type}`}>{message}</div>}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={form.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Login</button>

        <p className="mt-1">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
        <p className="mt-1">
  <Link to="/forgot-password">Forgot Password?</Link>
</p>
      </form>
    </div>
  );
}

export default LoginPage;
