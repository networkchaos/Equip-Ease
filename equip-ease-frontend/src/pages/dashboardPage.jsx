import React from 'react';

function DashboardPage({ user }) {
  if (!user) {
    return <p>Please log in to view the dashboard.</p>;
  }

  const roleActions = () => {
    switch (user.role) {
      case 'farmer':
        return (
          <>
            <h4>Farmer Actions</h4>
            <ul>
              <li>
                <span>View My Rentals (Coming Soon)</span>
              </li>
              <li>
                <a href="/listings">Browse Equipment for Rent</a>
              </li>
            </ul>
          </>
        );
      case 'owner':
        return (
          <>
            <h4>Equipment Owner Actions</h4>
            <ul>
              <li>
                <span>Manage My Equipment (Coming Soon)</span>
              </li>
              <li>
                <span>List New Equipment (Coming Soon)</span>
              </li>
            </ul>
          </>
        );
      case 'admin':
        return (
          <>
            <h4>Administrator Actions</h4>
            <ul>
              <li>Manage Users (Coming Soon)</li>
              <li>Manage Equipment Listings (Coming Soon)</li>
              <li>Manage Bookings (Coming Soon)</li>
            </ul>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>Welcome to your Dashboard, {user.fullName}!</h2>
      <p>
        Your role:{' '}
        <strong>
          {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
        </strong>
      </p>

      <div className="profile-summary card mt-1">
        <div className="card-content">
          <h3>Profile Summary</h3>
          <p>
            <strong>Name:</strong> {user.fullName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <button className="button secondary mt-1">Edit Profile</button>
        </div>
      </div>

      <div className="activity-feed card mt-1">
        <div className="card-content">
          <h3>Recent Activity</h3>
          <p>
            <em>No recent activity to display.</em>
          </p>
        </div>
      </div>

      <div className="role-actions card mt-1">
        <div className="card-content">{roleActions()}</div>
      </div>
    </div>
  );
}

export default DashboardPage;
