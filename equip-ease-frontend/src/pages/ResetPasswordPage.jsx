import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5001/api/reset-password/${token}`, { newPassword: password });
      setMsg('Password reset successful. Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setMsg('Reset failed. Invalid or expired token.');
    }
  };

  return (
    <div className="container">
      <h2>Reset Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" required value={password} placeholder="New password"
               onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Reset Password</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default ResetPasswordPage;
