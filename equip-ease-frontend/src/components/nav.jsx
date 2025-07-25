import React from 'react';
import { NavLink } from 'react-router-dom';

const Nav = ({ user }) => {
  return (
    <nav id="app-nav">
      <ul>
        <li><NavLink to="/" end>Home</NavLink></li>
        <li><NavLink to="/listings">Browse Equipment</NavLink></li>

        {user && user.role === 'farmer' && (
          <li><NavLink to="/my-rentals">My Rentals</NavLink></li>
        )}

        {user && user.role === 'admin' && (
          <li><NavLink to="/my-equipment">My Equipment</NavLink></li>
        )}

       
        <li><NavLink to="/community">Community</NavLink></li>

        {user && user.users_role === 'admin' && (
          <li><NavLink to="/admin">Admin</NavLink></li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
