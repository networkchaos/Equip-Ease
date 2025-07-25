// src/pages/NotificationsPage.jsx
import React from 'react';

const NotificationsPage = ({ user }) => {
  if (!user) {
    return <p>Please log in...</p>;
  }

  return (
    <div>
      <h2>Notifications</h2>
      <div className="card">
        <div className="card-content">
          <h3>Your Platform Notifications</h3>
          <p>
            <em>
              All your booking confirmations, payment alerts, maintenance reminders, etc. will show here with "mark as read" options. (Coming soon!)
            </em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
