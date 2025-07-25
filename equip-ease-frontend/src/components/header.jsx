import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { user, logoutUser } = useContext(AuthContext);

  return (
    <header id="app-header">
      <Link to="/" className="logo">
        <img src={logo} alt="Equip Ease Logo" /> Equip Ease
      </Link>
      <div className="user-actions">
        {user ? (
          <>
            <span>{user.fullName}</span>
            <button className="button secondary" onClick={logoutUser}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
