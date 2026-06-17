const API_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const login = async (credentials: any) => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email);
  formData.append('password', credentials.password);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString(),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Invalid credentials');
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const getMe = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getAuthHeaders(),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('Unauthorized');
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// --- Mock Data Fallbacks ---
const MOCK_FARMS = [
  { id: 'FRM-001', name: 'Green Valley', owner: 'Mock User', location: 'California, USA', crop_type: 'Bananas', area_acres: 120, expected_yield_tons: 450, status: 'Harvesting' },
  { id: 'FRM-002', name: 'Sunrise Orchards', owner: 'Alice Smith', location: 'Florida, USA', crop_type: 'Oranges', area_acres: 85, expected_yield_tons: 320, status: 'Growing' }
];

const MOCK_LOTS = [
  { id: 'LOT-001', farm_id: 'FRM-001', weight_tons: 24.5, quality_grade: 'A', status: 'Intake' },
  { id: 'LOT-002', farm_id: 'FRM-001', weight_tons: 18.2, quality_grade: 'B', status: 'Cold Storage' },
  { id: 'LOT-003', farm_id: 'FRM-002', weight_tons: 42.0, quality_grade: 'A', status: 'Exporting' }
];

const MOCK_BUYERS = [
  { id: 'BUY-001', name: 'Global Fresh Inc.', contact_person: 'John Doe', email: 'john@globalfresh.com', region: 'North America', status: 'Active' }
];

const MOCK_SHIPMENTS = [
  { id: 'SHP-001', buyer_id: 'BUY-001', container_number: 'CON-889', status: 'In Transit', current_location: 'Mid-Atlantic', temperature_c: 1.8 }
];

const fetchWithFallback = async (url: string, mockData: any) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s timeout for fast UI fallback
  try {
    const response = await fetch(url, { headers: getAuthHeaders(), signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error('API Error');
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`Backend fetch failed for ${url}. Using mock data.`);
    return mockData;
  }
};

// --- Buyers API ---
export const getBuyers = () => fetchWithFallback(`${API_URL}/buyers`, MOCK_BUYERS);
export const createBuyer = async (buyerData: any) => {
  const response = await fetch(`${API_URL}/buyers`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(buyerData) });
  if (!response.ok) throw new Error('Failed to create buyer');
  return response.json();
};

// --- Farms API ---
export const getFarms = () => fetchWithFallback(`${API_URL}/farms`, MOCK_FARMS);
export const createFarm = async (farmData: any) => {
  const response = await fetch(`${API_URL}/farms`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(farmData) });
  if (!response.ok) throw new Error('Failed to create farm');
  return response.json();
};

// --- Harvest Lots API ---
export const getHarvestLots = () => fetchWithFallback(`${API_URL}/harvest-lots`, MOCK_LOTS);
export const createHarvestLot = async (lotData: any) => {
  const response = await fetch(`${API_URL}/harvest-lots`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(lotData) });
  if (!response.ok) throw new Error('Failed to create harvest lot');
  return response.json();
};
export const updateLotStatus = async (id: string, status: string) => {
  const response = await fetch(`${API_URL}/harvest-lots/${id}/status`, { method: 'PATCH', headers: getAuthHeaders(), body: JSON.stringify({ status }) });
  if (!response.ok) throw new Error('Failed to update lot status');
  return response.json();
};

// --- Shipments API ---
export const getShipments = () => fetchWithFallback(`${API_URL}/shipments`, MOCK_SHIPMENTS);
export const getShipmentTelemetry = async (id: string) => {
  const response = await fetch(`${API_URL}/shipments/${id}/telemetry`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch shipment');
  return response.json();
};
export const advanceShipment = async (id: string) => {
  const response = await fetch(`${API_URL}/shipments/${id}/advance`, { method: 'POST', headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to advance shipment');
  return response.json();
};
export const createShipment = async (shipmentData: any) => {
  const response = await fetch(`${API_URL}/shipments`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(shipmentData) });
  if (!response.ok) throw new Error('Failed to create shipment');
  return response.json();
};
