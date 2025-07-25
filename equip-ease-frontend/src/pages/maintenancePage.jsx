import React from 'react';
import { getMaintenanceList } from '../services/store';

const MaintenancePage = () => {
  const maintenanceRecords = getMaintenanceList();

  return (
    <div>
      <h2>Equipment Maintenance</h2>
      <p>Track and manage your equipment maintenance logs.</p>

      <div className="card-grid">
        {maintenanceRecords.length === 0 ? (
          <p>No maintenance records available.</p>
        ) : (
          maintenanceRecords.map((record) => (
            <div key={record.id} className="card">
              <div className="card-content">
                <h3>{record.equipmentName}</h3>
                <p>
                  <strong>Date:</strong> {record.date}
                </p>
                <p>
                  <strong>Status:</strong> {record.status}
                </p>
                <p>
                  <strong>Notes:</strong> {record.notes}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;
