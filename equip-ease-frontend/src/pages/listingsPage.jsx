import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import placeholderImg from '../assets/placeholder_equipment.png';
import { getUser } from '../services/auth'; // like in CommunityPage
import axios from 'axios'; 
import html2pdf from 'html2pdf.js';


const ListingsPage = () => {
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [filteredEquipment, setFilteredEquipment] = useState([]);
  const [user, setUser] = useState(null);

  const fetchEquipment = async (forceRefresh = false) => {
    try {
      const local = JSON.parse(localStorage.getItem('all_equipment')) || [];

      if (!forceRefresh && local.length > 0) {
        setEquipment(local);
        setFilteredEquipment(local);
        return;
      }

      const res = await fetch('http://localhost:5001/api/equipment/all');
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error('Invalid data format');

      localStorage.setItem('all_equipment', JSON.stringify(data));
      setEquipment(data);
      setFilteredEquipment(data);
    } catch (err) {
      console.error('Error fetching equipment:', err);
      setEquipment([]);
      setFilteredEquipment([]);
    }
  };

  useEffect(() => {
    const u = getUser();
    setUser(u);
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
    const matchesName = item.equipment_name?.toLowerCase().includes(searchName);
    const matchesType = filterType ? item.equipment_type === filterType : true;
    return matchesName && matchesType;
  });

  setFilteredEquipment(filtered);
};


 const handleDelete = async (equipmentId) => {
  if (!user || !user.token) {
    alert("Not authorized.");
    return;
  }

  const confirmed = window.confirm("Are you sure you want to delete this equipment?");
  if (!confirmed) return;

  try {
    console.log("Deleting ID:", equipmentId);

    await axios.delete(`http://localhost:5001/api/equipment/delete/${equipmentId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    alert('Deleted successfully');
    // Optionally refresh the list here
  } catch (error) {
    console.error('Error deleting equipment:', error);
    alert('Failed to delete equipment');
  }
};


const handleGenerateReport = () => {
  const reportContent = document.createElement('div');
  reportContent.innerHTML = `
    <h3 style="text-align:center;">EQUIPMENT REPORT</h3>
    <p style="text-align:center;">Generated on ${new Date().toLocaleDateString()}</p>
    <table border="1" cellspacing="0" cellpadding="8" style="width:100%; border-collapse:collapse; font-family: Arial, sans-serif;">
      <thead style="background:#f0f0f0;">
        <tr>
          <th>S/No</th>
          <th>Name</th>
          <th>Type</th>
          <th>Location</th>
          <th>Price/Day (KES)</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${filteredEquipment.map((item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${item.equipment_name}</td>
            <td>${item.equipment_type}</td>
            <td>${item.equipment_location}</td>
            <td>${Number(item.equipment_price_per_day).toLocaleString()}</td>
            <td>${item.equipment_availability}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  html2pdf().from(reportContent).set({
    margin: 10,
    filename: `equipment_report_${new Date().toISOString().split('T')[0]}.pdf`,
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait' },
  }).save();
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
        <button className="btn btn-outline-secondary" onClick={() => fetchEquipment(true)}>🔄 Refresh Listings</button>
        <button className="btn btn-outline-secondary" onClick={handleGenerateReport}>📄 Export Report</button>

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
                  onClick={() =>
                    navigate(`/equipment/${item.equipment_equipment_id}`, {
                      state: { equipment: item },
                    })
                  }
                >
                  View Details
                </button>

                {/* ✅ Only show delete if user is admin */}
                {user?.users_role === 'admin' && (
  <button onClick={() => handleDelete(item.equipment_equipment_id)} className="btn btn-success mt-2">
    Delete
  </button>
)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListingsPage;
