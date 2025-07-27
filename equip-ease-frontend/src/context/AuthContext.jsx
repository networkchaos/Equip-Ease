// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getUser, logout } from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = getUser();
    if (storedUser && storedUser.token) {
      setUser(storedUser);
      setToken(storedUser.token); // ✅ get token from user object
    }
  }, []);

  const loginUser = (newUser) => {
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setToken(newUser.token); // ✅ get token from user object
  };

  const logoutUser = () => {
    logout();
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};


