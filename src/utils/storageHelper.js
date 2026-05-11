import { v4 as uuidv4 } from 'uuid';

const TRIPS_LIST_KEY = 'vibe_trips_list';

export const getAllTrips = () => {
  try {
    const list = localStorage.getItem(TRIPS_LIST_KEY);
    return list ? JSON.parse(list) : [];
  } catch (error) {
    console.error("Failed to parse trips list", error);
    return [];
  }
};

export const getTripData = (id) => {
  try {
    const data = localStorage.getItem(`vibe_trip_${id}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error("Failed to parse trip data", error);
    return null;
  }
};

export const setTripData = (id, data) => {
  try {
    localStorage.setItem(`vibe_trip_${id}`, JSON.stringify(data));
    
    // Update the metadata in the trips list
    const trips = getAllTrips();
    const tripIndex = trips.findIndex(t => t.id === id);
    if (tripIndex !== -1) {
      trips[tripIndex] = { ...trips[tripIndex], ...data.metadata };
      localStorage.setItem(TRIPS_LIST_KEY, JSON.stringify(trips));
    }
  } catch (error) {
    console.error("Failed to save trip data", error);
  }
};

export const createTrip = (title, currency = '₹') => {
  const newTripId = uuidv4();
  const newTripMeta = {
    id: newTripId,
    title: title || 'New Trip',
    startDate: new Date().toISOString().split('T')[0],
    currency
  };

  const trips = getAllTrips();
  trips.push(newTripMeta);
  localStorage.setItem(TRIPS_LIST_KEY, JSON.stringify(trips));

  const newTripData = {
    metadata: newTripMeta,
    participants: [],
    expenses: []
  };

  localStorage.setItem(`vibe_trip_${newTripId}`, JSON.stringify(newTripData));
  return newTripMeta;
};

export const deleteTrip = (id) => {
  const trips = getAllTrips();
  const newTrips = trips.filter(t => t.id !== id);
  localStorage.setItem(TRIPS_LIST_KEY, JSON.stringify(newTrips));
  localStorage.removeItem(`vibe_trip_${id}`);
};

export const migrateOldData = () => {
  // If there's an old single trip, migrate it to the new format
  const oldDataStr = localStorage.getItem('vibe_trip_data');
  if (oldDataStr) {
    try {
      const oldData = JSON.parse(oldDataStr);
      const newId = uuidv4();
      oldData.metadata = { ...oldData.metadata, id: newId };
      
      const trips = getAllTrips();
      trips.push(oldData.metadata);
      localStorage.setItem(TRIPS_LIST_KEY, JSON.stringify(trips));
      localStorage.setItem(`vibe_trip_${newId}`, JSON.stringify(oldData));
      
      localStorage.removeItem('vibe_trip_data');
    } catch (e) {
      console.error('Migration failed', e);
    }
  }
};
