// controllers/equipmentController.js
const db = require('../config/db');

const { addEquipment, getAllEquipment } = require('../models/equipmentModel');

const addNewEquipment = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      price,
      status,
      location,
      maintenanceDate
    } = req.body;

    const image = req.file?.filename || null;

    const ownerId = req.user.Users_user_id; // ✅ Get user ID from token

    const equipment = await addEquipment({
      name,
      type,
      description,
      price,
      status,
      location,
      maintenanceDate,
      image,
      ownerId
    });

    res.status(201).json(equipment);
  } catch (error) {
    console.error('Error adding equipment:', error.message);
    res.status(500).json({ message: 'Server error adding equipment' });
  }
};

const getEquipmentList = async (req, res) => {
  try {
    const equipmentList = await getAllEquipment();
    res.json(
      equipmentList.map((item) => ({
        _id: item.equipment_equipment_id,
        name: item.equipment_name,
        type: item.equipment_type,
        description: item.equipment_description,
        price: item.equipment_price_per_day,
        status: item.equipment_availability,
        location: item.equipment_location,
        maintenanceDate: item.equipment_maintenance_date,
        imageUrl: item.equipment_image_url,
        ownerId: item.equipment_owner_id
      }))
    );
  } catch (err) {
    console.error('Error getting equipment:', err.message);
    res.status(500).json({ message: 'Server error fetching equipment' });
  }
};
const getAllEquipmentPublic = async (req, res) => {
  try {
    const equipmentList = await getAllEquipment();
    console.log("Fetched equipment from DB:", equipmentList); // 👈 Add this
    res.json(
      equipmentList.map((item) => ({
        _id: item.equipment_id,
        name: item.equipment_name,
        type: item.equipment_type,
        description: item.equipment_description,
        price: item.equipment_price,
        status: item.equipment_status,
        location: item.equipment_location,
        maintenanceDate: item.equipment_maintenance_date,
        imageUrl: item.equipment_image,
        ownerId: item.users_user_id,
      }))
    );
  } catch (err) {
    console.error("Error fetching public equipment:", err.message);
    res.status(500).json({ message: "Server error fetching equipment" });
  }
};

const deleteEquipmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'Invalid equipment ID' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Admins only' });
    }

    const result = await db.query(
      'DELETE FROM Equipment WHERE Equipment_equipment_id = $1 RETURNING *',
      [parseInt(id, 10)]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.status(200).json({ message: 'Equipment deleted successfully' });
  } catch (err) {
    console.error('Error deleting equipment:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addNewEquipment, getEquipmentList, getAllEquipmentPublic, deleteEquipmentById, };
