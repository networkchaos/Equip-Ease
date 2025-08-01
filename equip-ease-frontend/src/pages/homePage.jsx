import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import placeholderImg from '../assets/placeholder_equipment.png';
import heroBg from '../assets/hero_background.png';
import farmerIcon from '../assets/farmer_howitworks_icon.png';
import ownerIcon from '../assets/owner_howitworks_icon.png';
import secureIcon from '../assets/secure_howitworks_icon.png';
import { getUser } from '../services/auth';

const HomePage = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [user, setUser] = useState(null);

  const fetchEquipment = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/equipment/all');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid data format');
      setEquipment(data.slice(0, 3)); // Only first 3
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setEquipment([]);
    }
  };

  useEffect(() => {
    setUser(getUser());
    fetchEquipment();
  }, []);

  const handleImageError = (e) => {
    e.target.src = placeholderImg;
  };

  return (
    <div className="container mt-1">
      <div className="hero" style={{ backgroundImage: `url(${heroBg})` }}>
        <h1>Welcome to Equip Ease</h1>
        <p>Your one-stop platform for sharing and renting farm equipment.</p>
        <button
          id="browse-equip-btn"
          className="button accent"
          onClick={() => navigate('/listings')}
        >
          Browse Equipment
        </button>
      </div>

      <section className="mt-1">
        <h2 className="text-center">How It Works</h2>
        <div className="card-grid mt-1">
          <div className="card text-center">
            <img src={farmerIcon} alt="For Farmers" className="how-it-works-icon" />
            <h3>For Farmers</h3>
            <p>Easily find and rent the equipment you need, when you need it.</p>
          </div>
          <div className="card text-center">
            <img src={ownerIcon} alt="For Equipment Owners" className="how-it-works-icon" />
            <h3>For Equipment Owners</h3>
            <p>Monetize your idle machinery by listing it for rent.</p>
          </div>
          <div className="card text-center">
            <img src={secureIcon} alt="Secure & Easy" className="how-it-works-icon" />
            <h3>Secure & Easy</h3>
            <p>Secure transactions and transparent rental processes (M-Pesa integration coming soon!).</p>
          </div>
        </div>
      </section>

      <section className="mt-1">
        <h2 className="text-center">Featured Equipment</h2>
        <p className="text-center">Check out some of the popular equipment available.</p>
        <div className="card-grid">
          {equipment.length === 0 ? (
            <p className="text-center">No featured equipment available at the moment.</p>
          ) : (
            equipment.map((item) => (
              <div key={item.equipment_equipment_id} className="card equipment-item">
                <img
                  src={
                    item.equipment_image_url
                      ? `http://localhost:5001/uploads/${item.equipment_image_url}`
                      : placeholderImg
                  }
                  alt={item.equipment_name}
                  onError={handleImageError}
                />
                <div className="card-content">
                  <h3>{item.equipment_name}</h3>
                  <p><strong>Type:</strong> {item.equipment_type}</p>
                  <p><strong>Price:</strong> KES {Number(item.equipment_price_per_day).toLocaleString()}</p>
                  <p><strong>Location:</strong> {item.equipment_location}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span className={`status-${item.equipment_availability?.toLowerCase()}`}>
                      {item.equipment_availability}
                    </span>
                  </p>

                  <button
                    className="btn btn-success mt-2"
                    onClick={() =>
                      navigate(`/equipment/${item.equipment_equipment_id}`, {
                        state: { equipment: item },
                      })
                    }
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="text-center mt-1">
          <button
            id="view-all-listings-btn"
            className="button"
            onClick={() => navigate('/listings')}
          >
            View All Listings
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
