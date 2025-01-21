import Swal from 'sweetalert2';
import axios from 'axios';

const SaveButton = () => {
  const API_BASE_URL = 'http://localhost:3000';

  const fetchFromIndexedDB = (storeName) => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('WebSocketDataDB');
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const getAllRequest = store.getAll();

        getAllRequest.onsuccess = () => {
          resolve(getAllRequest.result);
        };

        getAllRequest.onerror = () => {
          reject(getAllRequest.error);
        };
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  };

  const handleSaveOverall = async () => {
    try {
      const overallData = await fetchFromIndexedDB('runsByDriverStore');

      const result = await Swal.fire({
        title: 'Save Overall Data',
        text: 'Do you want to save overall data?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        const { status } = await axios.post(`${API_BASE_URL}/api-save-overall`, overallData);

        console.log(overallData, '--debug overallData');

        if (status === 200) {
          Swal.fire('Saved!', 'Overall data has been saved successfully.', 'success');
        } else {
          Swal.fire('Error', 'Failed to save overall data.', 'error');
        }
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch data or save overall data.', 'error');
    }
  };

  const handleSaveBestTime = async () => {
    try {
      const bestTimeData = await fetchFromIndexedDB('leaderboardStore');

      const result = await Swal.fire({
        title: 'Save Best Time Data',
        text: 'Do you want to save best time data?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, save it!',
        cancelButtonText: 'Cancel'
      });

      if (result.isConfirmed) {
        const { status } = await axios.post(`${API_BASE_URL}/api-save-best-time`, bestTimeData);

        if (status === 200) {
          Swal.fire('Saved!', 'Best time data has been saved successfully.', 'success');
        } else {
          Swal.fire('Error', 'Failed to save best time data.', 'error');
        }
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch data or save best time data.', 'error');
    }
  };

  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={handleSaveOverall}
        className="p-3 bg-red-700 text-white rounded cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save Overall
      </button>
      <button
        type="button"
        onClick={handleSaveBestTime}
        className="p-3 bg-yellow-700 text-white rounded cursor-pointer hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save Best Time
      </button>
    </div>
  );
};

export default SaveButton;
