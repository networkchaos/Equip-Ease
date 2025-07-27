// src/components/LogoutButton.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LogoutButton = () => {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login'); // Now safe inside router context
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
