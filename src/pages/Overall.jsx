import React, { useState, useEffect } from 'react';
import { TreeTable } from 'primereact/treetable';
import { Column } from 'primereact/column';
import { useWebSocket } from '../context/WebsocketContext';
import { Dropdown } from 'primereact/dropdown';

export default function Overall() {
  const { runsByDriver } = useWebSocket(); // Access WebSocket context for data
  const [isDropdownVisible, setIsDropdownVisible] = useState(true);

  // Function to generate the structure for the TreeTable
  const generateTableData = () => {
    return Object.keys(runsByDriver).map((driverName) => {
      const cars = runsByDriver[driverName];
      const carNodes = Object.keys(cars).map((carName) => {
        return {
          key: `${driverName}-${carName}`,
          data: {
            driverName,
            carName,
            lapTimes: cars[carName].join(', ')
          },
          children: [] // No nested children in this case
        };
      });
      return {
        key: driverName,
        data: {
          driverName,
          carName: '',
          lapTimes: ''
        },
        children: carNodes
      };
    });
  };

  // Prepare data for TreeTable
  const treeTableData = generateTableData();

  return (
    <div className="card">
      <TreeTable value={treeTableData} tableStyle={{ minWidth: '50rem' }}>
        <Column field="driverName" header="Driver Name" expander />
        <Column
          field="carName"
          header="Car Name"
          body={(rowData) => (
            <div>
              <Dropdown
                value={rowData.data.carName}
                options={Object.keys(runsByDriver[rowData.data.driverName]).map((carName) => ({
                  label: carName,
                  value: carName
                }))}
                onChange={(e) => console.log(e.value)}
                placeholder="Select Car"
                autoFocus
                overlayVisible={isDropdownVisible} // Keep dropdown expanded
                onFocus={() => setIsDropdownVisible(true)} // Keep it open when focused
                onBlur={() => setIsDropdownVisible(true)} // Keep it open even when blurred
              />
            </div>
          )}
        />
        <Column field="lapTimes" header="Lap Times" />
      </TreeTable>
    </div>
  );
}
