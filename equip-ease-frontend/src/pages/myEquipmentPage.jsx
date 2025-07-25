// src/pages/MyEquipmentPage.jsx
import React, { useEffect, useState } from 'react';

const MyEquipmentPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    setUser(currentUser);
  }, []);

  if (!user) {
    return <p className="text-center">Please log in...</p>;
  }

  if (user.role !== 'owner') {
    return (
      <div className="container mt-1">
        <div className="card">
          <div className="card-content">
            <h3>Access Denied</h3>
            <p>This page is only for equipment owners.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-1">
      <div className="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Equipment</h2>
        <button className="button accent" disabled>
          + Add New Equipment (Coming Soon)
        </button>
      </div>

      <div className="card mt-1">
        <div className="card-content">
          <h3>Equipment List</h3>
          <p>
            <em>
              List, edit, and manage your equipment here. (Upload photos, edit
              info, manage bookings)
            </em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyEquipmentPage;
