// src/services/reviewService.js
import { getUser } from './auth';
const API_URL = 'http://localhost:5001/api/reviews';

// Add a new review
export const addReview = async (reviewData) => {
  const user = getUser();
  const token = user?.token;

  try {
    const response = await fetch(`http://localhost:5001/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // ✅ Include token
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error('Failed to add review');
    }

    return await response.json();
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};

// Fetch reviews for a specific equipment ID
export const getReviewsByEquipment = async (equipmentId) => {
  try {
    const response = await fetch(`${API_URL}/equipment/${equipmentId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};
