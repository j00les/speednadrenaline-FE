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

const updateLeaderboardById = async (id) => {
  const db = await openDatabase();
  const transaction = db.transaction(LEADERBOARD_STORE, 'readwrite');
  const objectStore = transaction.objectStore(LEADERBOARD_STORE);

  const updatedData = {
    id: 69,
    name: 'memek',
    time: '0020888',
    driveTrain: 'FWD',
    carName: 'gr yaris 69'
  };
  await objectStore.put(updatedData);

  return transaction.complete;
};

const deleteRecordById = async (id) => {
  const db = await openDatabase();
  const transaction = db.transaction(LEADERBOARD_STORE, 'readwrite');
  const objectStore = transaction.objectStore(LEADERBOARD_STORE);

  await objectStore.delete(id);

  return transaction.complete;
};

const addLeaderboardData = async (payload) => {
  const { name, time, driveTrain, carName } = payload;
  const db = await openDatabase();

  await db.add(LEADERBOARD_STORE, {
    name,
    time,
    driveTrain,
    carName
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

export { initializeDB, deleteIndexedDB, saveLeadeboardData, addLeaderboardData, deleteRecordById };
