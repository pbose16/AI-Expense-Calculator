import { setTripData, getTripData } from '../utils/storageHelper';

// Placeholder for future backend integrations
export const syncTripData = async (data) => {
  // CURRENT: Local Storage implementation
  setTripData(data);
  
  // FUTURE: Placeholder for backend
  // return await fetch('/api/v1/sync', { method: 'POST', body: JSON.stringify(data) });
  
  return Promise.resolve({ success: true });
};

export const fetchTripData = async () => {
  // CURRENT: Local Storage implementation
  const data = getTripData();
  
  // FUTURE: Placeholder for backend
  // const response = await fetch('/api/v1/data');
  // const data = await response.json();
  
  return Promise.resolve(data);
};
