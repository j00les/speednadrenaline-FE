import React from 'react';
import { useWebSocket } from '../context/WebsocketContext';

const Overall = () => {
  const { runsByDriver } = useWebSocket();

  return (
    <div className="overflow-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-4 py-2 text-left">Driver Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Car and Lap Times</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(runsByDriver).map(([driverName, cars]) => (
            <tr key={driverName}>
              {/* Driver Name Column */}
              <td className="border border-gray-300 px-4 py-2 font-bold align-top">{driverName}</td>
              {/* Nested Car and Lap Times Column */}
              <td className="border border-gray-300 px-4 py-2">
                {Object.entries(cars).map(([carName, lapTimes]) => (
                  <div key={carName} className="mb-2">
                    <div className="font-semibold">{carName}</div>
                    <ul className="ml-4 list-disc">
                      {lapTimes.map((time, index) => (
                        <li key={index}>{time}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Overall;
