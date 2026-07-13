const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

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
  const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s for Render cold start

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

export const register = async (userData: any) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

export const getMe = async () => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 45000);

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

export const updateProfile = async (data: { full_name?: string; email?: string; current_password?: string; new_password?: string }) => {
  const response = await fetch(`${API_URL}/auth/update-profile`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Failed to update profile');
  }
  return response.json();
};

// --- Buyers API ---
export const getBuyers = async () => {
  const response = await fetch(`${API_URL}/buyers`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
};
export const createBuyer = async (buyerData: any) => {
  const response = await fetch(`${API_URL}/buyers`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(buyerData) });
  if (!response.ok) throw new Error('Failed to create buyer');
  return response.json();
};
export const updateBuyer = async (id: string, buyerData: any) => {
  const response = await fetch(`${API_URL}/buyers/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(buyerData) });
  if (!response.ok) throw new Error('Failed to update buyer');
  return response.json();
};
export const deleteBuyer = async (id: string) => {
  const response = await fetch(`${API_URL}/buyers/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to delete buyer');
  return response.json();
};

// --- Farms API ---
export const getFarms = async () => {
  const response = await fetch(`${API_URL}/farms`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
};
export const createFarm = async (farmData: any) => {
  const response = await fetch(`${API_URL}/farms`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(farmData) });
  if (!response.ok) throw new Error('Failed to create farm');
  return response.json();
};
export const updateFarm = async (id: string, farmData: any) => {
  const response = await fetch(`${API_URL}/farms/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(farmData) });
  if (!response.ok) throw new Error('Failed to update farm');
  return response.json();
};
export const deleteFarm = async (id: string) => {
  const response = await fetch(`${API_URL}/farms/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to delete farm');
  return response.json();
};

// --- Harvest Lots API ---
export const getHarvestLots = async () => {
  const response = await fetch(`${API_URL}/harvest-lots`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
};
export const createHarvestLot = async (lotData: any) => {
  const response = await fetch(`${API_URL}/harvest-lots`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(lotData) });
  if (!response.ok) throw new Error('Failed to create harvest lot');
  return response.json();
};
export const updateHarvestLot = async (id: string, lotData: any) => {
  const response = await fetch(`${API_URL}/harvest-lots/${id}`, { method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(lotData) });
  if (!response.ok) throw new Error('Failed to update harvest lot');
  return response.json();
};
export const updateLotStatus = async (id: string, status: string) => {
  const response = await fetch(`${API_URL}/harvest-lots/${id}/status`, { method: 'PATCH', headers: getAuthHeaders(), body: JSON.stringify({ status }) });
  if (!response.ok) throw new Error('Failed to update lot status');
  return response.json();
};
export const deleteHarvestLot = async (id: string) => {
  const response = await fetch(`${API_URL}/harvest-lots/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to delete harvest lot');
  return response.json();
};

// --- Shipments API ---
export const getShipments = async () => {
  const response = await fetch(`${API_URL}/shipments`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error(`API ${response.status}`);
  return response.json();
};
export const getShipmentTelemetry = async (id: string) => {
  const response = await fetch(`${API_URL}/shipments/${id}/telemetry`, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to fetch shipment');
  return response.json();
};
export const advanceShipment = async (id: string) => {
  const response = await fetch(`${API_URL}/shipments/${id}/advance`, { method: 'PATCH', headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to advance shipment');
  return response.json();
};
export const createShipment = async (shipmentData: any) => {
  const response = await fetch(`${API_URL}/shipments`, { method: 'POST', headers: getAuthHeaders(), body: JSON.stringify(shipmentData) });
  if (!response.ok) throw new Error('Failed to create shipment');
  return response.json();
};
export const deleteShipment = async (id: string) => {
  const response = await fetch(`${API_URL}/shipments/${id}`, { method: 'DELETE', headers: getAuthHeaders() });
  if (!response.ok) throw new Error('Failed to delete shipment');
  return response.json();
};
