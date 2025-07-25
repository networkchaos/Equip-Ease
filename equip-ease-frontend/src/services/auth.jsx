import axios from 'axios';

const API = 'http://localhost:5001/api';

export const register = async (userData) => {
  const response = await axios.post(`${API}/register`, userData);
  const { token, user } = response.data;
  const fullUser = { ...user, token }; // ✅ store token inside the user object
  localStorage.setItem('user', JSON.stringify(fullUser));
  return fullUser;
};

export const login = async (email, password) => {
  const response = await axios.post(`${API}/login`, { email, password });
  const { token, user } = response.data;
  const fullUser = { ...user, token }; // ✅ store token inside the user object
  localStorage.setItem('user', JSON.stringify(fullUser));
  return fullUser;
};

export const getUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (err) {
    console.error('Invalid user data in localStorage:', err);
    localStorage.removeItem('user'); // Clean up corrupted state
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
};
