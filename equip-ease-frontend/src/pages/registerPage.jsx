import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
const RegisterPage = () => {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'farmer',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, role } = formData;

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    const roleToSave = role === 'equipment owner' ? 'admin' : role;

    try {
      const fullUser = await register({ fullName, email, password, role: roleToSave });
loginUser(fullUser); // auto-login user
setMessage({ type: 'success', text: 'Registration successful! Redirecting...' });
setTimeout(() => navigate('/'), 1000);
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error?.message ||
          (typeof error === 'string' ? error : 'Registration failed'),
      });
    }
  };

  return (
    <div className="container mt-1">
      <form onSubmit={handleSubmit}>
        <h2>Register for Equip Ease</h2>

        {message.text && (
          <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`}>
            {message.text}
          </div>
        )}

        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Register as:</label>
          <select name="role" value={formData.role} onChange={handleChange} required>
            <option value="farmer">Farmer</option>
            <option value="equipment owner">Equipment Owner</option>
          </select>
        </div>

        <button type="submit" className="button accent">
          Register
        </button>

        <p className="mt-1">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
