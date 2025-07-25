// services/store.js

const mockData = [
  {
    Equipment_equipment_id: 'mock1',
    Equipment_name: 'Mock Tractor',
    Equipment_type: 'tractor',
    Equipment_price_per_day: 3500,
    Equipment_location: 'Nakuru',
    Equipment_availability: 'available',
    Equipment_image_url: '/mock-tractor.jpg',
    Equipment_description: 'A mock tractor for demo use.'
  },
  {
    Equipment_equipment_id: 'mock2',
    Equipment_name: 'Mock Harvester',
    Equipment_type: 'harvester',
    Equipment_price_per_day: 5000,
    Equipment_location: 'Eldoret',
    Equipment_availability: 'unavailable',
    Equipment_image_url: '/mock-harvester.jpg',
    Equipment_description: 'A mock harvester for demo use.'
  }
];

// src/services/store.js

export const getEquipmentList = async () => {
  try {
    const response = await fetch('http://localhost:5001/api/equipment/all');
    const data = await response.json();

    // Ensure field names match ListingsPage.jsx
    return data.map((item) => ({
      equipment_equipment_id: item._id,
      equipment_name: item.name,
      equipment_type: item.type,
      equipment_description: item.description,
      equipment_location: item.location,
      equipment_price_per_day: item.price,
      equipment_image_url: item.image_url,
      equipment_availability: item.status,
    }));
  } catch (error) {
    console.error('Failed to fetch equipment list:', error);
    return [];
  }
};


export const getEquipmentById = async (id) => {
  try {
    const list = await getEquipmentList();
    const allItems = [...list, ...mockData];

    const found = allItems.find(item => item.equipment_equipment_id === id);
    if (!found) return null;

    return {
      id: found.equipment_equipment_id,
      name: found.equipment_name,
      type: found.equipment_type,
      description: found.equipment_description || 'No description provided.',
      location: found.equipment_location,
      availability: found.equipment_availability,
      pricePerDay: found.equipment_price_per_day,
      imageUrl: found.equipment_image_url?.startsWith('http')
        ? found.equipment_image_url
        : `http://localhost:5001/uploads/${found.equipment_image_url || ''}`
    };
  } catch (err) {
    console.error('Error fetching equipment by ID:', err);
    return null;
  }
};