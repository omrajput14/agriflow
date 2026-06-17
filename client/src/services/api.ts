const API_URL = 'http://localhost:8000/api';

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

// --- Harvest Lots API ---
export const getHarvestLots = async () => {
  const response = await fetch(`${API_URL}/harvest-lots`);
  if (!response.ok) throw new Error('Failed to fetch harvest lots');
  return response.json();
};

export const createHarvestLot = async (lotData: any) => {
  const response = await fetch(`${API_URL}/harvest-lots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lotData),
  });
  if (!response.ok) throw new Error('Failed to create harvest lot');
  return response.json();
};

export const updateLotStatus = async (id: string, status: string) => {
  const response = await fetch(`${API_URL}/harvest-lots/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to update lot status');
  return response.json();
};

// --- Shipments API ---
export const getShipments = async () => {
  const response = await fetch(`${API_URL}/shipments`);
  if (!response.ok) throw new Error('Failed to fetch shipments');
  return response.json();
};

export const getShipmentTelemetry = async (id: string) => {
  const response = await fetch(`${API_URL}/shipments/${id}/telemetry`);
  if (!response.ok) throw new Error('Failed to fetch shipment');
  return response.json();
};

export const advanceShipment = async (id: string) => {
  const response = await fetch(`${API_URL}/shipments/${id}/advance`, {
    method: 'PATCH',
  });
  if (!response.ok) throw new Error('Failed to advance shipment');
  return response.json();
};

export const createShipment = async (shipmentData: any) => {
  const response = await fetch(`${API_URL}/shipments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(shipmentData),
  });
  if (!response.ok) throw new Error('Failed to create shipment');
  return response.json();
};
