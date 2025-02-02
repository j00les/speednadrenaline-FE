import React from 'react';

const RunDropdown = ({ driverRuns, selectedRun, handleRunSelect, handleDeleteRun }) => {
  return (
    <div className="relative flex items-center gap-2">
      {/* ✅ Dropdown Select */}
      <select
        value={selectedRun || ''}
        onChange={handleRunSelect}
        className="py-2 border rounded-md bg-white text-black w-full px-3"
      >
        {driverRuns.length > 0 ? (
          driverRuns.map((run) => (
            <option key={run.runNumber} value={run.time}>
              Run {run.runNumber}: {run.time}
            </option>
          ))
        ) : (
          <option value="" disabled>
            No Runs Available
          </option>
        )}
      </select>

      {/* ✅ Delete Button (Only if More Than 1 Run) */}
      {driverRuns.length > 1 && selectedRun !== driverRuns[0].time && (
        <button
          onClick={handleDeleteRun}
          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-800"
        >
          ❌
        </button>
      )}
    </div>
  );
};

export default RunDropdown;
