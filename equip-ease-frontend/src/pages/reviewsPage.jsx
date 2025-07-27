// ReviewsPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const demoReviews = [
  {
    id: 'r1',
    equipment: 'John Deere Tractor 5075E',
    date: '2024-06-16',
    rating: 5,
    comment: 'Powerful and very reliable! Highly recommended.',
  },
  {
    id: 'r2',
    equipment: 'Claas Combine Harvester',
    date: '2024-06-01',
    rating: 4,
    comment: 'Did the job perfectly. Pickup was easy.',
  },
];

const equipmentOptions = [
  { id: 'eq-1', name: 'John Deere Tractor 5075E' },
  { id: 'eq-2', name: 'Claas Combine Harvester' },
  { id: 'eq-3', name: 'Precision Planter' },
];

const renderStars = (rating) => '★'.repeat(rating) + '☆'.repeat(5 - rating);

const ReviewForm = ({ onSubmit, message }) => (
  <form onSubmit={onSubmit} style={{ marginBottom: '1.5rem' }}>
    <h3>Leave Feedback (After Rental)</h3>

    <div className="form-group">
      <label htmlFor="equipment">Equipment</label>
      <select id="equipment" name="equipment" required>
        {equipmentOptions.map(({ id, name }) => (
          <option key={id} value={id}>{name}</option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="rating">Rating</label>
      <select id="rating" name="rating" required>
        {[5, 4, 3, 2, 1].map((val) => (
          <option key={val} value={val}>
            {renderStars(val)} - {['Terrible', 'Poor', 'Fair', 'Good', 'Excellent'][5 - val]}
          </option>
        ))}
      </select>
    </div>

    <div className="form-group">
      <label htmlFor="review-comment">Comment</label>
      <textarea
        id="review-comment"
        name="review-comment"
        placeholder="Your feedback..."
        maxLength="256"
        required
      />
    </div>

    <button type="submit">Submit Review</button>

    {message && <div className="alert alert-success" style={{ marginTop: 10 }}>{message}</div>}
  </form>
);

const ReviewsTable = ({ reviews }) => (
  <>
    <h3>Submitted Reviews</h3>
    <table className="reviews-table" style={{ width: '100%' }}>
      <thead>
        <tr>
          <th>Equipment</th>
          <th>Date</th>
          <th>Rating</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {reviews.map(({ id, equipment, date, rating, comment }) => (
          <tr key={id}>
            <td>{equipment}</td>
            <td>{date}</td>
            <td><span className="review-stars">{renderStars(rating)}</span></td>
            <td>{comment}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </>
);

const ReviewsPage = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState(demoReviews);
  const [message, setMessage] = useState('');

  const equipmentName = equipmentOptions.find(e => e.id === id)?.name || '';
  const filteredReviews = reviews.filter(r => !id || r.equipment === equipmentName);

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const equipmentId = form.equipment.value;
    const rating = parseInt(form.rating.value, 10);
    const comment = form['review-comment'].value;
    const name = equipmentOptions.find(e => e.id === equipmentId)?.name || '';

    const newReview = {
      id: `r-${Date.now()}`,
      equipment: name,
      date: new Date().toISOString().split('T')[0],
      rating,
      comment,
    };

    setReviews([newReview, ...reviews]);
    setMessage(`Thanks! Your review for ${name} was submitted.`);
    form.reset();
    setTimeout(() => setMessage(''), 2200);
  };

  return (
    <div>
      <h2>Reviews {equipmentName && `for ${equipmentName}`}</h2>
      <div className="card">
        <div className="card-content">
          <ReviewForm onSubmit={handleSubmit} message={message} />
          <ReviewsTable reviews={filteredReviews} />
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;
