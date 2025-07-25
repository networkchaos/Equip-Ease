import React, { useState, useEffect } from 'react';

const PaymentsPage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('currentUser'));
    setUser(storedUser); // Optional: You can even remove this line if user is no longer needed
    setBookings([
      {
        bookingId: 'booking-1',
        equipmentId: 'eq-1',
        equipmentName: 'John Deere Tractor 5075E',
        date: '2024-06-22',
        price: 150,
        status: 'pending',
        receiptUrl: null,
      },
      {
        bookingId: 'booking-2',
        equipmentId: 'eq-2',
        equipmentName: 'Claas Combine Harvester',
        date: '2024-06-14',
        price: 300,
        status: 'paid',
        receiptUrl: '#',
      },
    ]);
  }, []);

  const handlePayment = (bookingId) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.bookingId === bookingId
          ? { ...b, status: 'paid', receiptUrl: '#' }
          : b
      )
    );
    alert('Payment successful! Receipt will be available soon (UI only).');
  };

  return (
    <div className="container mt-1">
      <h2>My Payments</h2>
      <div className="card">
        <div className="card-content">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Equipment</th>
                <th>Date</th>
                <th>Amount (KES)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b.bookingId}>
                  <td>{b.equipmentName}</td>
                  <td>{b.date}</td>
                  <td>KES {b.price}</td>
                  <td>
                    <span className={`status-${b.status}`}>
                      {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    {b.status === 'pending' ? (
                      <button className="button accent" onClick={() => handlePayment(b.bookingId)}>
                        Pay with M-Pesa
                      </button>
                    ) : (
                      <a href={b.receiptUrl || '#'} className="button secondary" target="_blank" rel="noreferrer">
                        View Receipt
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-1">
            <em>
              Pay securely using M-Pesa for your equipment rentals. Once paid, your receipt will be available for download.
            </em>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
