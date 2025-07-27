import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/forgot-password', { email });
      setMsg('Password reset link sent to your email (check console).');
    } catch (err) {
      setMsg('Error sending reset link.');
    }
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} required placeholder="Enter your email"
               onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Send Reset Link</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
