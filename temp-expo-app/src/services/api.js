import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3001/api';
  }
  return 'http://localhost:3001/api';
};

export const API_BASE_URL = getBaseUrl();

async function apiRequest(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    options.signal = controller.signal;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[API] HTTP error ${response.status} on ${endpoint}`);
      return null;
    }
    return await response.json();
  } catch (err) {
    console.warn(`[API] Network error on ${endpoint}:`, err?.message || err);
    return null;
  }
}

export const api = {
  checkHealth: () => apiRequest('/health'),
  getState: () => apiRequest('/state'),

  // Auth
  login: (phone, otp) => apiRequest('/auth/login', 'POST', { phone, otp }),
  register: (phone, name, location, otp) => apiRequest('/auth/register', 'POST', { phone, name, location, otp }),

  // Cattle
  registerCow: (cowData) => apiRequest('/cows', 'POST', cowData),

  // Complaints / Violations
  createComplaint: (complaintData) => apiRequest('/complaints', 'POST', complaintData),
  payComplaint: (id) => apiRequest(`/complaints/${id}/pay`, 'PUT'),
  disputeComplaint: (id) => apiRequest(`/complaints/${id}/dispute`, 'PUT'),
  escalateComplaint: (id, department, adminPhone) =>
    apiRequest(`/complaints/${id}/escalate`, 'PUT', { department, adminPhone }),

  // Missing cattle
  reportMissing: (reportData) => apiRequest('/missing', 'POST', reportData),

  // Disease Alerts
  reportDiseaseAlert: (alertData) => apiRequest('/alerts', 'POST', alertData),

  // Emergency Injured SOS
  reportInjuredSOS: (reportData) => apiRequest('/injured', 'POST', reportData),

  // Adoptions
  requestAdoption: (adoptionId, requestData) => apiRequest('/adoptions/request', 'POST', { adoptionId, requestData }),
  createAdoption: (data) => apiRequest('/adoptions', 'POST', data),

  // Roles & Inventory
  assignRole: (phone, name, role, adminPhone) =>
    apiRequest('/users/assign-role', 'POST', { phone, name, role, adminPhone }),
  allocateInventory: (phone, amount, userPhone) =>
    apiRequest('/inventory/transfer', 'POST', { phone, amount, userPhone }),
  requestTags: (reqData) => apiRequest('/tag-requests', 'POST', reqData),
  approveTagRequest: (id) => apiRequest(`/tag-requests/${id}/approve`, 'PUT'),

  // Audit Logs
  getAuditLogs: () => apiRequest('/audit-logs'),
};
