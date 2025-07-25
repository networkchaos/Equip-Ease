// src/pages/AdminDashboardPage.jsx
import React, { useState } from 'react';

function AdminDashboardPage() {
  const [equipment, setEquipment] = useState({
    name: '',
    type: '',
    description: '',
    price: '',
    status: '',
    location: '',
    maintenanceDate: '',
    images: [],
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setEquipment((prev) => ({ ...prev, images: files }));
    } else {
      setEquipment((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData();

  const user = JSON.parse(localStorage.getItem('user')); // 👈 Get logged-in user
  
  formData.append('ownerId', user.Users_user_id); // 👈 Append to formData
  formData.append('name', equipment.name);
  formData.append('type', equipment.type);
  formData.append('description', equipment.description);
  formData.append('price', equipment.price);
  formData.append('status', equipment.status);
  formData.append('location', equipment.location);
  formData.append('maintenanceDate', equipment.maintenanceDate);
  if (equipment.images.length > 0) {
    formData.append('image', equipment.images[0]);
  }

  try {
    const response = await fetch('http://localhost:5001/api/equipment/add', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`, // 👈 Send token
  },
  body: formData,
});
    if (!response.ok) throw new Error('Failed to upload');

    const data = await response.json();
    alert('✅ Equipment added successfully!');
    console.log('Response:', data);
    handleClear();
  } catch (error) {
    console.error('❌ Upload failed:', error);
    alert('❌ Failed to add equipment');
  }
};
  const handleClear = () => {
    setEquipment({
      name: '',
      type: '',
      description: '',
      price: '',
      status: '',
      location: '',
      maintenanceDate: '',
      images: [],
    });
  };

  return (
    <div className="container py-4">
      <h4 className="text-success fw-bold mb-4">➕ Add New Equipment for Rent</h4>
      <div className="bg-white p-4 rounded shadow-sm">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Equipment Name</label>
              <input type="text" name="name" className="form-control" value={equipment.name} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Type</label>
              <select name="type" className="form-select" value={equipment.type} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="Tractor">Tractor</option>
                <option value="Harvester">Harvester</option>
                <option value="Plough">Plough</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-control" rows="3" value={equipment.description} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Price (KES/day)</label>
              <input type="number" name="price" className="form-control" value={equipment.price} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Availability</label>
              <select name="status" className="form-select" value={equipment.status} onChange={handleChange} required>
                <option value="">Set Status</option>
                <option value="Available">Available</option>
                <option value="Unavailable">Unavailable</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Location</label>
              <input type="text" name="location" className="form-control" value={equipment.location} onChange={handleChange} required />
            </div>
            <div className="col-md-6">
              <label className="form-label">Maintenance Date</label>
              <input type="date" name="maintenanceDate" className="form-control" value={equipment.maintenanceDate} onChange={handleChange} />
            </div>
            <div className="col-12">
              <label className="form-label">Equipment Image</label>
              <input type="file" name="images" className="form-control" accept=".jpg,.jpeg,.png" onChange={handleChange} />
            </div>
          </div>
          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn btn-success">🚜 Submit</button>
            <button type="button" className="btn btn-secondary" onClick={handleClear}>🧹 Clear</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
