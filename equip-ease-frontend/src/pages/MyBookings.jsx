import React, { useEffect, useState } from 'react';
import { fetchBookings } from '../services/bookingService';
import { getEquipmentById } from '../services/store';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings();
        const userBookings = data.filter(
          (booking) => booking.user_id === currentUser?.id
        );

        // Fetch equipment info
        const bookingsWithDetails = await Promise.all(
          userBookings.map(async (booking) => {
            const equipment = await getEquipmentById(booking.equipment_id);
            return {
              ...booking,
              equipment_name: equipment?.Equipment_name,
              equipment_image: equipment?.Equipment_image_url,
            };
          })
        );

        setBookings(bookingsWithDetails);
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [currentUser]);

  if (loading) return <p>Loading your bookings...</p>;

  return (
    <div className="container mt-2">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="booking-card">
              <img
                src={
                  booking.equipment_image?.startsWith('http')
                    ? booking.equipment_image
                    : `http://localhost:5000${booking.equipment_image}`
                }
                alt={booking.equipment_name}
              />
              <div>
                <h3>{booking.equipment_name}</h3>
                <p>
                  <strong>Start:</strong> {new Date(booking.start_date).toDateString()}
                </p>
                <p>
                  <strong>End:</strong> {new Date(booking.end_date).toDateString()}
                </p>
                <p>
                  <strong>Status:</strong> {booking.status || 'Booked'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
