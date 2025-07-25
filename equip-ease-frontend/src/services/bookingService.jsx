// src/services/bookingService.js
// src/services/bookingService.js
import { getUser } from './auth';

export const fetchBookings = async () => {
  const user = getUser();
  const token = user?.token;

  try {
    const response = await fetch('http://localhost:5001/api/bookings', {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Include token here
      },
    });
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return [];
  }
};

export const addBooking = async (bookingData) => {
  const user = getUser();
  const token = user?.token;

  try {
    const response = await fetch('http://localhost:5001/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ✅ Include token
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) throw new Error('Booking failed');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to add booking:', error);
    throw error;
  }
};
