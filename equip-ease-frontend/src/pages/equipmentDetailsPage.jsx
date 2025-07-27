import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import placeholderImg from '../assets/placeholder_equipment.png';
import html2pdf from 'html2pdf.js';
import { getUser } from '../services/auth';

const EquipmentDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showMpesaPopup, setShowMpesaPopup] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentProcessingPopup, setPaymentProcessingPopup] = useState(false);
  const [paymentSuccessPopup, setPaymentSuccessPopup] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState(state?.equipment);

  useEffect(() => {
    const u = getUser();
    setUser(u);

    if (u && currentEquipment?.equipment_equipment_id) {
      const storedBookings = JSON.parse(localStorage.getItem(`bookings_${u.username}`)) || [];
      setBookings(storedBookings.filter(b => b.equipment_id === currentEquipment.equipment_equipment_id));
    }

    if (currentEquipment?.equipment_equipment_id) {
      loadLocalReviews(currentEquipment.equipment_equipment_id);
    }

    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }, [currentEquipment]);

  const loadLocalReviews = (equipmentId) => {
    const stored = JSON.parse(localStorage.getItem(`reviews_${equipmentId}`)) || [];
    setReviews(stored);
  };

  const {
    equipment_equipment_id,
    equipment_name,
    equipment_type,
    equipment_price_per_day,
    equipment_location,
    equipment_availability,
    equipment_image_url,
    equipment_description,
  } = currentEquipment || {};

  const handleImageError = (e) => {
    e.target.src = placeholderImg;
  };

    const handleInstantBooking = () => {
  if (!startDate || !endDate) return alert('Please select start and end date.');
  if (!user) return alert('You must be logged in to book.');

  const newBooking = {
    equipment_id: currentEquipment.equipment_equipment_id,
    equipment_name: currentEquipment.equipment_name,
    start_date: startDate,
    end_date: endDate,
    user: user.username,
    createdAt: new Date().toISOString(),
    status: 'RENTED'
  };

  const storageKey = `bookings_${user.username}`;
  const prev = JSON.parse(localStorage.getItem(storageKey)) || [];

  const exists = prev.some(b =>
    b.equipment_id === newBooking.equipment_id &&
    b.start_date === newBooking.start_date &&
    b.end_date === newBooking.end_date
  );
  if (exists) {
    alert('You have already booked this equipment for the selected dates.');
    return;
  }

  const updated = [...prev, newBooking];
  localStorage.setItem(storageKey, JSON.stringify(updated));
  setBookings(updated);

  // ✅ Update local equipment and all_equipment storage
  const updatedEquipment = {
    ...currentEquipment,
    equipment_availability: 'RENTED'
  };
  setCurrentEquipment(updatedEquipment);

  const allEquipment = JSON.parse(localStorage.getItem('all_equipment')) || [];
  const updatedAll = allEquipment.map(e => 
    e.equipment_equipment_id === updatedEquipment.equipment_equipment_id
      ? updatedEquipment
      : e
  );
  localStorage.setItem('all_equipment', JSON.stringify(updatedAll));

  // ✅ Notify other components (like ListingsPage)
  window.dispatchEvent(new Event('equipmentUpdated'));

  alert('Booking successful! Equipment is now marked as RENTED.');
};


  const triggerSTKPush = async () => {
    if (!phoneNumber || !startDate || !endDate) {
      alert('Please fill all fields before paying.');
      return;
    }

    try {
      setPaymentLoading(true);
      const res = await axios.post('http://localhost:5001/api/stkpush', {
        phoneNumber,
        amount: equipment_price_per_day,
        equipmentId: equipment_equipment_id,
        equipmentName: equipment_name,
        startDate,
        endDate,
        user: user?.username || 'Unknown User'
      });

      if (res.data.success) {
        alert('STK Push sent. Please check your phone.');
        setShowMpesaPopup(false);
        setPaymentProcessingPopup(true);

        setTimeout(() => {
          setPaymentProcessingPopup(false);
          setPaymentSuccessPopup(true);
          createBooking();
        }, 6000);
      } else {
        alert('Failed to initiate payment.');
      }
    } catch (error) {
      console.error('STK Push Error:', error);
      alert('Error sending STK Push.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const createBooking = () => {
    if (!user || !user.username) return;

    const newBooking = {
      equipment_id: currentEquipment.equipment_equipment_id,
      equipment_name: currentEquipment.equipment_name,
      start_date: startDate,
      end_date: endDate,
      user: user.username,
      createdAt: new Date().toISOString(),
      status: 'RENTED'
    };

    const storageKey = `bookings_${user.username}`;
    const prev = JSON.parse(localStorage.getItem(storageKey)) || [];

    const exists = prev.some(b =>
      b.equipment_id === newBooking.equipment_id &&
      b.start_date === newBooking.start_date &&
      b.end_date === newBooking.end_date
    );
    if (exists) return;

    const updated = [...prev, newBooking];
    setBookings(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    setCurrentEquipment(prev => ({
      ...prev,
      equipment_availability: 'RENTED'
    }));

    const allEquipment = JSON.parse(localStorage.getItem('all_equipment')) || [];
    const updatedEquipment = allEquipment.map(e => {
      if (e.equipment_equipment_id === currentEquipment.equipment_equipment_id) {
        return { ...e, equipment_availability: 'RENTED' };
      }
      return e;
    });
    localStorage.setItem('all_equipment', JSON.stringify(updatedEquipment));
  };

  const handleReviewSubmit = () => {
    if (!reviewText.trim()) return;
    if (!user) return alert('You must be logged in to submit a review.');

    const newReview = {
      username: user.username,
      comment: reviewText,
      date: new Date().toISOString(),
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews_${equipment_equipment_id}`, JSON.stringify(updated));
    setReviewText('');
  };

  const generatePDFReceipt = () => {
    const receiptHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h2 style="color: green;">Equipment Rental Receipt</h2>
        <p><strong>Equipment:</strong> ${equipment_name}</p>
        <p><strong>Amount Paid:</strong> KES ${Number(equipment_price_per_day).toLocaleString()}</p>
        <p><strong>Booking Period:</strong> ${startDate} to ${endDate}</p>
        <p><strong>Phone Number:</strong> ${phoneNumber}</p>
        <p><strong>Date Issued:</strong> ${new Date().toLocaleString()}</p>
        <p style="margin-top: 20px; font-size: 0.9em;">Thank you for choosing our service.</p>
      </div>
    `;
    html2pdf().from(receiptHTML).save('mpesa_receipt.pdf');
  };

  if (!currentEquipment) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>Equipment Not Found</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>{equipment_name}</h2>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        <img
          src={equipment_image_url ? `http://localhost:5001/uploads/${equipment_image_url}` : placeholderImg}
          onError={handleImageError}
          alt={equipment_name}
          style={{ width: '100%', maxWidth: '450px', height: '300px', objectFit: 'cover', borderRadius: '10px' }}
        />

        <div style={{ flex: 1 }}>
          <p><strong>Type:</strong> {equipment_type}</p>
          <p><strong>Price/Day:</strong> KES {Number(equipment_price_per_day).toLocaleString()}</p>
          <p><strong>Location:</strong> {equipment_location}</p>
          <p>
            <strong>Status:</strong>{' '}
            <span style={{ color: bookings.some(b => b.status === 'RENTED') ? 'red' : 'green' }}>
              {bookings.some(b => b.status === 'RENTED') ? 'RENTED' : equipment_availability}
            </span>
          </p>
          <p><strong>Description:</strong> {equipment_description || 'No description provided.'}</p>

          <h3>Book Equipment</h3>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />

          <div style={{ marginTop: '20px' }}>
            <h3>Payment</h3>
            <button onClick={handleInstantBooking} style={buttonStyle}>📅 Book Now</button>
            <button onClick={() => setShowMpesaPopup(true)} style={blueButton}>Pay with M-Pesa</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Booking History</h3>
        {bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <div>
            {bookings.map((b, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#f4f4f4',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  border: '1px solid #ddd',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                }}
              >
                <p><strong>User:</strong> {b.user}</p>
                <p><strong>Booking Period:</strong> {b.start_date} to {b.end_date}</p>
                <p><strong>Return Date:</strong> {b.end_date}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span style={{ color: b.status === 'RENTED' ? '#16a34a' : '#999' }}>
                    {b.status || 'PENDING'}
                  </span>
                </p>
                <p><strong>Contact:</strong> {phoneNumber || 'N/A'}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Leave a Review</h3>
        <textarea
          rows="3"
          value={reviewText}
          onChange={e => setReviewText(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
        ></textarea>
        <br />
        <button onClick={handleReviewSubmit} style={grayButton}>Submit Review</button>

        <div style={{ marginTop: '20px' }}>
          <h4>User Reviews</h4>
          {reviews.length === 0 ? <p>No reviews yet.</p> : reviews.map((r, i) => (
            <div key={i} style={{ background: '#f4f4f4', padding: '10px', borderRadius: '6px', marginBottom: '10px' }}>
              <strong>{r.username || 'Anonymous'}</strong>
              <p>{r.comment}</p>
              <small>{new Date(r.date).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>

      {showMpesaPopup && (
        <div style={popupBackdrop}>
          <div style={popupBox}>
            <h3>M-Pesa Payment</h3>
            <p><strong>Amount:</strong> KES {Number(equipment_price_per_day).toLocaleString()}</p>
            <p><strong>Booking:</strong> {startDate} to {endDate}</p>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              style={inputStyle}
            />
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button onClick={triggerSTKPush} style={buttonStyle} disabled={paymentLoading}>
                {paymentLoading ? 'Sending...' : 'Send STK Push'}
              </button>
              <button onClick={() => setShowMpesaPopup(false)} style={redButton}>Close</button>
            </div>
          </div>
        </div>
      )}

      {paymentProcessingPopup && (
        <div style={popupBackdrop}>
          <div style={{ ...popupBox, textAlign: 'center' }}>
            <div style={{
              margin: '20px auto',
              width: '50px',
              height: '50px',
              border: '6px solid #f3f3f3',
              borderTop: '6px solid #16a34a',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Processing Payment...</p>
          </div>
        </div>
      )}

      {paymentSuccessPopup && (
        <div style={popupBackdrop}>
          <div style={{ ...popupBox, animation: 'fadeIn 0.5s ease-in-out' }}>
            <h3 style={{ color: 'green' }}>🎉 Payment Completed</h3>
            <p><strong>{equipment_name}</strong> has been successfully loaned!</p>
            <p><strong>Booking Period:</strong> {startDate} to {endDate}</p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button onClick={generatePDFReceipt} style={grayButton}>🧾 Download Receipt</button>
              <button onClick={() => setPaymentSuccessPopup(false)} style={redButton}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  margin: '8px 0',
  borderRadius: '6px',
  border: '1px solid #ccc'
};

const buttonStyle = {
  backgroundColor: '#16a34a',
  color: 'white',
  padding: '10px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer'
};

const grayButton = { ...buttonStyle, backgroundColor: '#555' };
const redButton = { ...buttonStyle, backgroundColor: '#dc2626' };
const blueButton = { ...buttonStyle, backgroundColor: '#2563eb' };

const popupBackdrop = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

const popupBox = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '400px',
  boxShadow: '0 0 10px rgba(0,0,0,0.2)'
};

export default EquipmentDetailsPage;
