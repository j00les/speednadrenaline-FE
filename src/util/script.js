const inputPage = document.getElementById('input');
const leaderboardPage = document.getElementById('leaderboard');
const lapForm = document.getElementById('lapForm');
const table = document.querySelector('.table');
const deleteButton = document.getElementById('deleteData');

const colors = ['red', 'blue', 'green', 'orange', 'yellow', 'violet'];

const records = {};
const socket = new WebSocket('ws://localhost:3000');

// Listen for real-time updates from the server
socket.onmessage = (event) => {
  const updatedRecord = JSON.parse(event.data);

  console.log(updatedRecord, '--debug cobain aja');

  const driverKey = `${updatedRecord.name}-${updatedRecord.carName}`;
  records[driverKey] = updatedRecord;

  updateLeaderboard();
};

// check if lapform exist first
if (lapForm) {
  lapForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let name = document.getElementById('name').value.trim().toUpperCase();
    const lapTimeString = document.getElementById('lapTime').value.trim().toUpperCase();
    const carName = document.getElementById('car').value.trim().toUpperCase();

    if (name.length > 18) {
      name = name.slice(0, 11);
    }

    //  Parse the lap time input (e.g., "0050000" to "00:50:000")
    const formattedTime = formatLapTime(lapTimeString);

    // Convert lap time to milliseconds for comparison
    const lapTimeMilliseconds = timeToMilliseconds(formattedTime);

    const driverKey = `${name}-${carName}`;

    // Check if the record exists
    if (records[driverKey]) {
      // Compare the existing record with the new lap time
      if (lapTimeMilliseconds < records[driverKey].lapTime) {
        records[driverKey].lapTime = lapTimeMilliseconds;
        records[driverKey].lapTimeString = formattedTime;

        // Send updated record to the server
        socket.send(JSON.stringify(records[driverKey]));
      }
    } else {
      // Assign a random color from the colors array
      const indexNumber = Math.floor(Math.random() * colors.length);
      const randomColor = colors[indexNumber];

      // Create a new record
      const newRecord = {
        name,
        carName,
        lapTime: lapTimeMilliseconds,
        lapTimeString: formattedTime,
        colorClass: randomColor
      };

      records[driverKey] = newRecord;

      // Send new record to the server
      socket.send(JSON.stringify(newRecord));
    }

    updateLeaderboard();
    lapForm.reset();
  });
}

// Format input time (e.g., 0050000 to 00:50:000)
const formatLapTime = (timeString) => {
  const paddedTime = timeString.padStart(7, '0');
  const minutes = paddedTime.substring(0, 2);
  const seconds = paddedTime.substring(2, 4);
  const milliseconds = paddedTime.substring(4);
  return `${minutes}:${seconds}:${milliseconds}`;
};

// Convert formatted time to milliseconds
const timeToMilliseconds = (formattedTime) => {
  const [minutes, seconds, milliseconds] = formattedTime.split(':');
  return (
    parseInt(minutes) * 60000 + // Minutes to milliseconds
    parseInt(seconds) * 1000 + // Seconds to milliseconds
    parseInt(milliseconds) // Milliseconds
  );
};

const isOdd = (number) => {
  return number % 2 !== 0;
};

const updateLeaderboard = () => {
  const sortedRecords = Object.values(records).sort((a, b) => a.lapTime - b.lapTime);
  const top20Records = sortedRecords.slice(0, 20);
  const rows = document.querySelectorAll('.table tr');

  saveToIndexedDB(records);

  rows.forEach((row, index) => {
    if (index !== 0) row.remove();
  });

  if (leaderboardPage) {
    top20Records.forEach((record, index) => {
      const newRow = document.createElement('tr');
      const position = index + 1;
      const isSingleDigit = position < 10;
      const isMoreThanTen = position > 10;
      const positionClass = isSingleDigit ? 'single-digit' : '';
      newRow.id = 'raceDataRow';

      if (isOdd(index)) {
        newRow.style.backgroundColor = '#D0D0D0';
      }

      const rowColorClass = isMoreThanTen ? 'black' : record.colorClass;

      newRow.innerHTML = `
        <td class="position">
          <div class="player-position ${positionClass}" style="color: black;" >${position}</div>
          <div class="color-box ${rowColorClass}"></div>
          <div class="player-name">
            <p class="name">${record.name}</p>
          </div>
        </td>
        <td class="time">
          <div class="player-time">
             <p class="time-text">${record.lapTimeString}</p>
          </div>
        </td>
        <td class="car">${record.carName}</td>
      `;

      if (isMoreThanTen) {
        // newRow.style.backgroundColor = '#FFFFFF';

        // change font style for > 10
        const nameElements = newRow.querySelectorAll('.name');
        nameElements.forEach((element) => {
          element.style.fontFamily = 'Titillium Web, sans-serif';
          element.style.fontWeight = 600;
          element.style.fontSize = '20.5px';
        });

        record.colorClass = 'black';
      }

      table.appendChild(newRow);
    });
  }

  if (inputPage) {
    sortedRecords.forEach((record, index) => {
      const newRow = document.createElement('tr');
      const position = index + 1;
      const isSingleDigit = position < 10;
      const isMoreThanTen = position > 10;
      const positionClass = isSingleDigit ? 'single-digit' : '';
      newRow.id = `raceDataRow-${index}`; // Unique ID for each row

      // Apply alternating row colors
      if (isOdd(index)) {
        newRow.style.backgroundColor = '#D0D0D0';
      }

      const rowColorClass = isMoreThanTen ? 'black' : record.colorClass;

      newRow.innerHTML = `
        <td class="position">
          <div class="player-position ${positionClass}" style="color: black;">${position}</div>
          <div class="color-box ${rowColorClass}"></div>
          <div class="player-name">
            <p class="name">${record.name}</p>
          </div>
        </td>
        <td class="time">
          <div class="player-time">
             <p class="time-text">${record.lapTimeString}</p>
          </div>
        </td>
        <td class="car">${record.carName}</td>
        <td class="delete">
          <button class="delete-button" data-key="${record.name}-${record.carName}">Delete</button>
        </td>
      `;

      // Apply additional styling for rows with position > 10
      if (isMoreThanTen) {
        const nameElements = newRow.querySelectorAll('.name');
        nameElements.forEach((element) => {
          element.style.fontFamily = 'Titillium Web, sans-serif';
          element.style.fontWeight = 600;
          element.style.fontSize = 'large';
        });

        record.colorClass = 'black';
      }

      // Append the new row to the table
      table.appendChild(newRow);
    });

    // Add event listener for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const recordKey = button.getAttribute('data-key');
        if (records[recordKey]) {
          delete records[recordKey]; // Remove the record from memory
          saveToIndexedDB(Object.values(records)); // Update IndexedDB
          updateLeaderboard(); // Refresh the table
        }
      });
    });
  }
};

// export result to csv
if (document.getElementById('exportData')) {
  document.getElementById('exportData').addEventListener('click', () => {
    const sortedRecords = Object.values(records).sort((a, b) => a.lapTime - b.lapTime);

    // Convert leaderboard data to CSV
    let csvContent = 'Name,Car,Lap Time\n'; // Header row
    sortedRecords.forEach((record) => {
      csvContent += `${record.name},${record.carName},${record.lapTimeString}\n`;
    });

    // Create a downloadable CSV file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hasil_balap.csv'; // File name
    link.click();

    // Clean up the URL object
    URL.revokeObjectURL(url);
  });
}

const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RaceLeaderboard', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Check if the object store exists
      if (!Array.from(db.objectStoreNames).includes('records')) {
        db.createObjectStore('records', { keyPath: 'id', autoIncrement: true });
        console.log("Object store 'records' created.");
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const saveToIndexedDB = (data) => {
  initIndexedDB().then((db) => {
    const transaction = db.transaction(['records'], 'readwrite');
    const store = transaction.objectStore('records');

    // Clear the store before saving the updated data
    store.clear();

    Object.values(data).forEach((record) => {
      store.add(record);
    });

    transaction.oncomplete = () => {
      console.log('Data saved to IndexedDB.');
    };

    transaction.onerror = (event) => {
      console.error('Error saving data:', event.target.error);
    };
  });
};

const loadFromIndexedDB = () => {
  return new Promise((resolve, reject) => {
    initIndexedDB().then((db) => {
      const transaction = db.transaction(['records'], 'readonly');
      const store = transaction.objectStore('records');
      const request = store.getAll();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    });
  });
};

// Load records on page load
window.addEventListener('DOMContentLoaded', () => {
  loadFromIndexedDB().then((data) => {
    if (data.length > 0) {
      data.forEach((record) => {
        const driverKey = `${record.name}-${record.carName}`;
        records[driverKey] = record;
      });
      updateLeaderboard();
    }
  });
});

if (deleteButton) {
  document.getElementById('deleteData').addEventListener('click', () => {
    // Ask for confirmation before deleting
    const isConfirmed = confirm('Are you sure you want to clear all data?');
    if (!isConfirmed) {
      return; // Do nothing if the user cancels
    }

    const databaseName = 'RaceLeaderboard';
    const objectStoreName = 'records';

    const openRequest = indexedDB.open(databaseName);

    openRequest.onsuccess = (event) => {
      const db = event.target.result;

      const transaction = db.transaction(objectStoreName, 'readwrite');
      const objectStore = transaction.objectStore(objectStoreName);

      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = () => {
        console.log(`All data in the object store '${objectStoreName}' has been cleared.`);
        alert(`All data in the object store '${objectStoreName}' has been cleared.`);
      };

      clearRequest.onerror = (errorEvent) => {
        console.error('Failed to clear the object store:', errorEvent.target.error);
        alert('Failed to clear the object store.');
      };
    };

    openRequest.onerror = (errorEvent) => {
      console.error('Failed to open the database:', errorEvent.target.error);
      alert('Failed to open the database.');
    };
  });
}
