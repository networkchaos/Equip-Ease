// src/pages/MyRentalsPage.jsx
import React from 'react';

const MyRentalsPage = ({ user }) => {
  if (!user) {
    return <p>Please log in...</p>;
  }

  if (user.role !== 'farmer') {
    return (
      <div className="card">
        <div className="card-content">
          <h3>Access Denied</h3>
          <p>This page is only for farmers.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2>My Rentals</h2>
      <div className="card">
        <div className="card-content">
          <h3>Your Upcoming and Past Rentals</h3>
          <p>
            <em>
              Booking calendar, rental status, and cancel action will appear here.
            </em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyRentalsPage;
