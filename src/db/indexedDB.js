import { openDB, deleteDB } from 'idb';

import { DATABASE_NAME, LEADERBOARD_STORE, RUNS_STORE } from '../constants';

const openDatabase = async () => {
  const db = openDB(DATABASE_NAME, 1);
  return db;
};

const initializeDB = async () => {
  const databaseVersion = 1;

  await openDB(DATABASE_NAME, databaseVersion, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(LEADERBOARD_STORE)) {
        db.createObjectStore(LEADERBOARD_STORE, {
          keyPath: 'id',
          autoIncrement: true
        });
      }
      if (!db.objectStoreNames.contains(RUNS_STORE)) {
        db.createObjectStore(RUNS_STORE, {
          keyPath: 'id',
          autoIncrement: true
        });
      }
    }
  });
};

const saveLeadeboardData = async (setLeaderboardData) => {
  const db = await openDatabase();
  const isStoreExist = db.objectStoreNames.contains(LEADERBOARD_STORE);

  if (isStoreExist) {
    const storedLeaderboard = await db.getAll(LEADERBOARD_STORE);
    setLeaderboardData(storedLeaderboard);
  }
};

const updateLeaderboardInIndexedDB = async (uniqueKey, updatedEntry) => {
  try {
    const db = await openDatabase(); // Open the IndexedDB
    const transaction = db.transaction(LEADERBOARD_STORE, 'readwrite');
    const objectStore = transaction.objectStore(LEADERBOARD_STORE);

    // Check if the entry exists in the database
    const existingEntry = await objectStore.get(uniqueKey);

    if (!existingEntry || parseInt(updatedEntry.time, 10) < parseInt(existingEntry.time, 10)) {
      // Add or update the entry in IndexedDB
      await objectStore.put({ ...updatedEntry, id: uniqueKey }); // Use `uniqueKey` as the ID
      console.log('Leaderboard entry updated in IndexedDB:', updatedEntry);
    }
  } catch (error) {
    console.error('Error updating leaderboard in IndexedDB:', error);
  }
};

const deleteRecordById = async (id) => {
  const db = await openDatabase();
  const transaction = db.transaction(LEADERBOARD_STORE, 'readwrite');
  const objectStore = transaction.objectStore(LEADERBOARD_STORE);

  await objectStore.delete(id);

  return transaction.complete;
};

const addLeaderboardData = async (payload, setLeaderboardData) => {
  const { name, time, driveTrain, carName } = payload;

  // Validate input
  if (!name || !carName || isNaN(parseInt(time, 10))) {
    console.error('Invalid payload: Missing required fields or invalid time.');
    return;
  }

  const db = await openDatabase();
  const transaction = db.transaction(LEADERBOARD_STORE, 'readwrite');
  const objectStore = transaction.objectStore(LEADERBOARD_STORE);

  // Fetch all existing entries from IndexedDB
  const existingEntries = await objectStore.getAll();
  const uniqueKey = `${name}-${carName}`;
  const existingEntry = existingEntries.find(
    (entry) => `${entry.name}-${entry.carName}` === uniqueKey
  );

  let newEntry;

  // Add or update the entry in IndexedDB
  if (!existingEntry || parseInt(time, 10) < parseInt(existingEntry.time, 10)) {
    newEntry = {
      name,
      time,
      driveTrain,
      carName
    };

    if (existingEntry) {
      // Update existing entry
      await objectStore.put({ ...existingEntry, ...newEntry });
    } else {
      // Add new entry
      await objectStore.add(newEntry);
    }

    console.log(`Leaderboard updated: ${name} - ${carName}`);
  } else {
    console.log(`No update needed: Slower or duplicate entry for ${name} - ${carName}`);
    return;
  }

  // Sync with state
  setLeaderboardData((prevLeaderboard) => {
    const leaderboardMap = prevLeaderboard.reduce((accumulator, currentEntry) => {
      const key = `${currentEntry.name}-${currentEntry.carName}`;
      accumulator[key] = currentEntry;
      return accumulator;
    }, {});

    // Add or update the new entry in the state
    leaderboardMap[uniqueKey] = newEntry;

    // Convert the map back to an array
    const updatedLeaderboard = Object.values(leaderboardMap);
    return updatedLeaderboard;
  });
};

const deleteIndexedDB = async (databaseName) => {
  try {
    await deleteDB(databaseName);
    console.log(`Database "${databaseName}" deleted successfully.`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting database "${databaseName}":`, error);
    return { success: false, error };
  }
};

export {
  initializeDB,
  deleteIndexedDB,
  saveLeadeboardData,
  addLeaderboardData,
  deleteRecordById,
  updateLeaderboardInIndexedDB
};
