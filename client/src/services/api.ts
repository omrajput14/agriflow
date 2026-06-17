const API_URL = 'http://127.0.0.1:8000/api';

// --- Buyers API ---
export const getBuyers = async () => {
  const response = await fetch(`${API_URL}/buyers`);
  if (!response.ok) throw new Error('Failed to fetch buyers');
  return response.json();
};

export const createBuyer = async (buyerData: any) => {
  const response = await fetch(`${API_URL}/buyers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buyerData),
  });
  if (!response.ok) throw new Error('Failed to create buyer');
  return response.json();
};

// --- Farms API ---
export const getFarms = async () => {
  const response = await fetch(`${API_URL}/farms`);
  if (!response.ok) throw new Error('Failed to fetch farms');
  return response.json();
};

export const createFarm = async (farmData: any) => {
  const response = await fetch(`${API_URL}/farms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(farmData),
  });
  if (!response.ok) throw new Error('Failed to create farm');
  return response.json();
};
