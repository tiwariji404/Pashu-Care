/**
 * REST API Client for Pashu Care Backend (Node.js & Express.js)
 * Connects frontend React.js application with backend REST API endpoints.
 */

const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const contentType = response.headers.get('content-type');
    let data = null;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      return { success: false, status: response.status, error: data?.error || data?.message || 'Request failed', data };
    }
    return { success: true, status: response.status, data };
  } catch (error) {
    console.warn(`[REST API] Call to ${endpoint} failed:`, error.message);
    return { success: false, error: error.message };
  }
}

// REST API Endpoints
export const api = {
  // Health check
  checkHealth: () => request('/health'),

  // Get synchronized server state
  getState: () => request('/state'),

  // Authentication
  login: (phone, otp) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, otp })
  }),

  register: (phone, name, location, otp) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ phone, name, location, otp })
  }),

  checkUser: (phone) => request(`/auth/check/${phone}`),

  // Roles & Inventory
  assignRole: (phone, name, role, adminPhone) => request('/users/assign-role', {
    method: 'POST',
    body: JSON.stringify({ phone, name, role, adminPhone })
  }),

  allocateInventory: (phone, amount, userPhone) => request('/inventory/transfer', {
    method: 'POST',
    body: JSON.stringify({ phone, amount: Number(amount), userPhone })
  }),

  updateInventory: (phone, total, remaining) => request('/users/inventory', {
    method: 'PUT',
    body: JSON.stringify({ phone, total, remaining })
  }),

  // Cattle / Cows
  getCows: () => request('/cows'),
  getCowByQrId: (qrId) => request(`/cows/${qrId}`),
  registerCow: (cowData) => request('/cows', {
    method: 'POST',
    body: JSON.stringify(cowData)
  }),

  // Complaints / Challans
  getComplaints: () => request('/complaints'),
  reportComplaint: (complaintData) => request('/complaints', {
    method: 'POST',
    body: JSON.stringify(complaintData)
  }),

  payChallan: (id) => request(`/complaints/${id}/pay`, {
    method: 'PUT'
  }),

  disputeChallan: (id) => request(`/complaints/${id}/dispute`, {
    method: 'PUT'
  }),

  escalateIssue: (id, department, adminPhone) => request(`/complaints/${id}/escalate`, {
    method: 'PUT',
    body: JSON.stringify({ department, adminPhone })
  }),

  // Missing cattle reports
  getMissing: () => request('/missing'),
  reportMissing: (reportData) => request('/missing', {
    method: 'POST',
    body: JSON.stringify(reportData)
  }),

  // Disease outbreak alerts
  getAlerts: () => request('/alerts'),
  reportAlert: (alertData) => request('/alerts', {
    method: 'POST',
    body: JSON.stringify(alertData)
  }),

  // Adoptions
  getAdoptions: () => request('/adoptions'),
  addAdoption: (listingData) => request('/adoptions', {
    method: 'POST',
    body: JSON.stringify(listingData)
  }),

  requestAdoption: (adoptionId, requestData) => request('/adoptions/request', {
    method: 'POST',
    body: JSON.stringify({ adoptionId, requestData })
  }),

  // Injured emergency reports
  getInjured: () => request('/injured'),
  reportInjured: (reportData) => request('/injured', {
    method: 'POST',
    body: JSON.stringify(reportData)
  }),

  // Notifications
  sendNotification: (notifData) => request('/notifications', {
    method: 'POST',
    body: JSON.stringify(notifData)
  }),

  // Tag Requests
  getTagRequests: () => request('/tag-requests'),
  requestTags: (phone, amount) => request('/tag-requests', {
    method: 'POST',
    body: JSON.stringify({ phone, amount })
  }),

  approveTagRequest: (id) => request(`/tag-requests/${id}/approve`, {
    method: 'PUT'
  }),

  // Audit Logs
  getAuditLogs: () => request('/audit-logs')
};

export default api;
