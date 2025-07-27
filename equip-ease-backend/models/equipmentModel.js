// models/equipmentModel.js
const db = require('../config/db');

const addEquipment = async (data) => {
  const result = await db.query(
    `INSERT INTO Equipment 
      (
        Equipment_name, 
        Equipment_type, 
        Equipment_description, 
        Equipment_price_per_day, 
        Equipment_availability, 
        Equipment_location, 
        Equipment_maintenance_date, 
        Equipment_image_url, 
        Equipment_owner_id
      )
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
    [
      data.name,
      data.type,
      data.description,
      data.price,
      data.status,
      data.location,
      data.maintenanceDate,
      data.image,
      data.ownerId
    ]
  );
  return result.rows[0];
};

const getAllEquipment = async (ownerId = null) => {
  let result;
  if (ownerId) {
    result = await db.query(`SELECT * FROM Equipment WHERE Equipment_owner_id = $1 ORDER BY Equipment_equipment_id DESC`, [ownerId]);
  } else {
    result = await db.query(`SELECT * FROM Equipment ORDER BY Equipment_equipment_id DESC`);
  }
  return result.rows;
};

module.exports = { addEquipment, getAllEquipment };
