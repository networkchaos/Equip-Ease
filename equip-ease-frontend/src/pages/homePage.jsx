import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEquipmentList } from '../services/store';
import heroBg from '../assets/hero_background.png';
import farmerIcon from '../assets/farmer_howitworks_icon.png';
import ownerIcon from '../assets/owner_howitworks_icon.png';
import secureIcon from '../assets/secure_howitworks_icon.png';
import placeholderImg from '../assets/placeholder_equipment.png';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredEquipment, setFeaturedEquipment] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      const equipment = await getEquipmentList();
      if (Array.isArray(equipment)) {
        const topThree = equipment.slice(0, 3);
        setFeaturedEquipment(topThree);
      } else {
        console.warn('Equipment data not in expected array format:', equipment);
      }
    };

    fetchFeatured();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/dashboard/${id}`);
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
          <div className="card">
            <div className="card-content text-center">
              <img src={farmerIcon} alt="For Farmers" className="how-it-works-icon" />
              <h3>For Farmers</h3>
              <p>
                Easily find and rent the equipment you need, when you need it. Save costs and
                improve your farm's productivity.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-content text-center">
              <img src={ownerIcon} alt="For Equipment Owners" className="how-it-works-icon" />
              <h3>For Equipment Owners</h3>
              <p>
                Monetize your idle machinery by listing it for rent. Help fellow farmers and earn
                extra income.
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-content text-center">
              <img src={secureIcon} alt="Secure & Easy" className="how-it-works-icon" />
              <h3>Secure & Easy</h3>
              <p>
                Our platform ensures secure transactions and transparent rental processes. (M-Pesa
                integration coming soon!)
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-1">
        <h2 className="text-center">Featured Equipment</h2>
        <p className="text-center">
          Check out some of the popular equipment available on our platform.
        </p>
        <div className="card-grid mt-1">
          {featuredEquipment.length > 0 ? (
            featuredEquipment.map((item) => (
              <div key={item.equipment_equipment_id} className="card equipment-item">
                <img
                  src={
                    item.equipment_image_url
                      ? `http://localhost:5001/uploads/${item.equipment_image_url}`
                      : placeholderImg
                  }
                  alt={item.equipment_name || 'Equipment'}
                  className="featured-equipment-image"
                  onError={(e) => (e.target.src = placeholderImg)}
                />
                <div className="card-content">
                  <h3>{item.equipment_name || 'Unnamed Equipment'}</h3>
                  <p>
                    <strong>Type:</strong>{' '}
                    {item.equipment_type
                      ? item.equipment_type.charAt(0).toUpperCase() + item.equipment_type.slice(1)
                      : 'Unknown'}
                  </p>
                  <p>
                    <strong>Price:</strong> KES{' '}
                    {item.equipment_price_per_day
                      ? Number(item.equipment_price_per_day).toLocaleString()
                      : 'N/A'}
                    /day
                  </p>
                  <button
                    className="button"
                    onClick={() => handleViewDetails(item.equipment_equipment_id)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">No featured equipment available at the moment.</p>
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
