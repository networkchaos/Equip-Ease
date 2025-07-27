import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import placeholderImg from '../assets/placeholder_equipment.png';

const ListingsPage = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);

 const fetchEquipment = async () => {
  try {
    const local = JSON.parse(localStorage.getItem('all_equipment')) || [];
    if (local.length > 0) {
      setEquipment(local);
      setFilteredEquipment(local);
      return;
    }

    const res = await fetch('http://localhost:5001/api/equipment/all');
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Invalid data format');

    localStorage.setItem('all_equipment', JSON.stringify(data)); // cache it
    setEquipment(data);
    setFilteredEquipment(data);
  } catch (err) {
    console.error('Error fetching equipment:', err);
    setEquipment([]);
    setFilteredEquipment([]);
  }
};


 useEffect(() => {
  fetchEquipment();

  const handleUpdate = () => fetchEquipment();
  window.addEventListener('equipmentUpdated', handleUpdate);

  return () => window.removeEventListener('equipmentUpdated', handleUpdate);
}, []);

  const handleImageError = (e) => {
    e.target.src = placeholderImg;
  };

  const handleApplyFilters = () => {
    const searchName = document.getElementById('search-name').value.toLowerCase();
    const filterType = document.getElementById('filter-type').value;
    const filtered = equipment.filter((item) => {
      const matchesName = item.name?.toLowerCase().includes(searchName);
      const matchesType = filterType ? item.type === filterType : true;
      return matchesName && matchesType;
    });
    setFilteredEquipment(filtered);
  };

  return (
    <div className="container mt-1">
      <h2>Equipment Listings</h2>
      <p>Browse available farm machinery for rent.</p>

      <div className="filters mb-3 d-flex gap-2">
        <input type="text" placeholder="Search by name..." id="search-name" className="form-control" />
        <select id="filter-type" className="form-select">
          <option value="">All Types</option>
          <option value="Tractor">Tractor</option>
          <option value="Harvester">Harvester</option>
          <option value="Plough">Plough</option>
        </select>
        <button className="btn btn-primary" onClick={handleApplyFilters}>Apply Filters</button>
        <button className="btn btn-outline-secondary" onClick={fetchEquipment}>🔄 Refresh Listings</button>
      </div>

      <div className="card-grid">
        {filteredEquipment.length === 0 ? (
          <p>No equipment available at the moment.</p>
        ) : (
          filteredEquipment.map((item) => (
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
      onClick={() => navigate(`/equipment/${item.equipment_equipment_id}`, { state: { equipment: item } })}

    >
      View Details
    </button>
  </div>
</div>

          ))
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
