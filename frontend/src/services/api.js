import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 unauthorized
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.search.includes('expired=true')) {
        window.location.href = '/?expired=true';
      }
    }
    return Promise.reject(error.response ? error.response.data : error);
  }
);

// Authentication & Profile
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// User Management (Admin & Profile)
export const usersApi = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  toggleStatus: (id, active) => api.put(`/users/${id}/status`, { active }),
  resetPassword: (id, password) => api.post(`/users/${id}/reset-password`, { password }),
  changeRole: (id, role) => api.put(`/users/${id}/role`, { role }),
  updateProfile: (data) => api.put('/users/profile', data),
  changePassword: (data) => api.post('/users/change-password', data),
};

// Cases
export const casesApi = {
  getAll: (params) => api.get('/cases', { params }),
  getById: (id) => api.get(`/cases/${id}`),
  getByNumber: (caseNumber) => api.get(`/cases/number/${caseNumber}`),
  create: (data) => api.post('/cases', data),
  update: (id, data) => api.put(`/cases/${id}`, data),
  delete: (id) => api.delete(`/cases/${id}`),
};

// Case Activities & Timeline
export const caseActivitiesApi = {
  getByCaseId: (caseId) => api.get(`/case-activities/case/${caseId}`),
  getByCaseNumber: (caseNumber) => api.get(`/case-activities/case-number/${caseNumber}`),
  getRecent: () => api.get('/case-activities/recent'),
  log: (data) => api.post('/case-activities', data),
};

// Persons
export const personsApi = {
  getAll: (params) => api.get('/persons', { params }),
  getById: (id) => api.get(`/persons/${id}`),
  getByPersonId: (personId) => api.get(`/persons/demo-id/${personId}`),
  create: (data) => api.post('/persons', data),
  update: (id, data) => api.put(`/persons/${id}`, data),
  delete: (id) => api.delete(`/persons/${id}`),
};

// Network, Relationships & Path Finding
export const networkApi = {
  getComplete: () => api.get('/network'),
  getByCase: (caseId) => api.get(`/network/case/${caseId}`),
  getByPerson: (personId) => api.get(`/network/person/${personId}`),
  getAllRelationships: (params) => api.get('/network/relationships', { params }),
  findPath: (source, target) => api.get('/network/path', { params: { source, target } }),
  createRelationship: (data) => api.post('/network/relationships', data),
  updateRelationship: (id, data) => api.put(`/network/relationships/${id}`, data),
  deleteRelationship: (id) => api.delete(`/network/relationships/${id}`),
};

// Evidence & Chain of Custody
export const evidenceApi = {
  getAll: (params) => api.get('/evidence', { params }),
  getById: (id) => api.get(`/evidence/${id}`),
  getCustody: (id) => api.get(`/evidence/${id}/custody`),
  create: (data) => api.post('/evidence', data),
  update: (id, data) => api.put(`/evidence/${id}`, data),
  addCustody: (id, data) => api.post(`/evidence/${id}/custody`, data),
  delete: (id) => api.delete(`/evidence/${id}`),
};

// Incidents
export const incidentsApi = {
  getAll: (params) => api.get('/incidents', { params }),
  getById: (id) => api.get(`/incidents/${id}`),
  create: (data) => api.post('/incidents', data),
  update: (id, data) => api.put(`/incidents/${id}`, data),
  delete: (id) => api.delete(`/incidents/${id}`),
};

// Locations
export const locationsApi = {
  getAll: (params) => api.get('/locations', { params }),
  getById: (id) => api.get(`/locations/${id}`),
  getByCode: (code) => api.get(`/locations/code/${code}`),
  create: (data) => api.post('/locations', data),
  update: (id, data) => api.put(`/locations/${id}`, data),
  delete: (id) => api.delete(`/locations/${id}`),
};

// Organizations
export const organizationsApi = {
  getAll: () => api.get('/organizations'),
  getById: (id) => api.get(`/organizations/${id}`),
  create: (data) => api.post('/organizations', data),
  update: (id, data) => api.put(`/organizations/${id}`, data),
  delete: (id) => api.delete(`/organizations/${id}`),
};

// Vehicles
export const vehiclesApi = {
  getAll: (params) => api.get('/vehicles', { params }),
  getById: (id) => api.get(`/vehicles/${id}`),
  create: (data) => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: (id) => api.delete(`/vehicles/${id}`),
};

// Communications
export const communicationsApi = {
  getAll: (params) => api.get('/communications', { params }),
  create: (data) => api.post('/communications', data),
  update: (id, data) => api.put(`/communications/${id}`, data),
  delete: (id) => api.delete(`/communications/${id}`),
};

// Investigation Notes
export const notesApi = {
  getAll: (params) => api.get('/notes', { params }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  togglePin: (id) => api.put(`/notes/${id}/pin`),
  delete: (id) => api.delete(`/notes/${id}`),
};

// In-App Notifications
export const notificationsApi = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
};

// Rule-Based Alerts (NON-AI)
export const alertsApi = {
  getAll: (params) => api.get('/alerts', { params }),
  updateStatus: (id, status) => api.put(`/alerts/${id}/status`, { status }),
  evaluateRules: () => api.post('/alerts/evaluate'),
};

// Reports
export const reportsApi = {
  getAll: () => api.get('/reports'),
  generate: (data) => api.post('/reports/generate', data),
};

// Audit Logs
export const auditLogsApi = {
  getAll: (params) => api.get('/audit-logs', { params }),
};

// Dashboard
export const dashboardApi = {
  getSummary: () => api.get('/dashboard/summary'),
};

// AI / ML Intelligence Microservice
export const aiApi = {
  getDashboard: () => api.get('/ml/dashboard'),
  runNetworkAnalysis: (data) => api.post('/ml/network-analysis', data || {}),
  runCommunityDetection: (data) => api.post('/ml/community-detection', data || {}),
  runAnomalyDetection: (data) => api.post('/ml/anomaly-detection', data || {}),
  runLinkPrediction: (data) => api.post('/ml/link-prediction', data || {}),
  runCaseSimilarity: (data) => api.post('/ml/case-similarity', data || {}),
  runClustering: (data) => api.post('/ml/clustering', data || {}),
  getModels: () => api.get('/ml/models'),
  getModelMetrics: () => api.get('/ml/model-metrics'),
  trainModels: (data) => api.post('/ml/train', data || {}),
  getDataset: () => api.get('/ml/dataset'),
  getResults: (params) => api.get('/ml/results', { params }),
  reviewResult: (id, status, user) => api.put(`/ml/results/${id}/review`, { status, user }),
  getPersonInsights: (personId) => api.get(`/ml/person/${personId}/insights`),
  getCaseInsights: (caseId) => api.get(`/ml/case/${caseId}/insights`),
  getModelComparison: () => api.get('/ml/model-comparison'),
  getNetworkChange: (period = '30d') => api.get(`/ml/network-change?period=${period}`),
  getPreprocessingDetails: () => api.get('/ml/preprocessing-details'),
};

// Search (Ctrl + K)
export const searchApi = {
  searchAll: (q) => api.get('/search', { params: { q } }),
};

// Data Sources & Web Scraper Engine (Section 30, 36)
export const dataSourcesApi = {
  getAll: () => api.get('/data-sources'),
  getById: (id) => api.get(`/data-sources/${id}`),
  create: (data) => api.post('/data-sources', data),
  update: (id, data) => api.put(`/data-sources/${id}`, data),
  sync: (id) => api.post(`/data-sources/${id}/sync`),
  getLogs: (id) => api.get(`/data-sources/${id}/logs`),
  getRecentLogs: () => api.get('/data-sources/logs'),
  testSource: (baseUrl) => api.post('/data-sources/test-source', { baseUrl }),
};

// Live Public Data Intelligence (Section 36, 51, 52)
export const liveDataApi = {
  getAll: (params) => api.get('/live-data', { params }),
  getTrends: () => api.get('/live-data/trends'),
  getStatistics: () => api.get('/live-data/statistics'),
};

// External Review (Human-in-the-Loop, Section 24, 36)
export const externalReviewApi = {
  getPending: () => api.get('/external-review'),
  approve: (id) => api.post(`/external-review/${id}/approve`),
  reject: (id) => api.post(`/external-review/${id}/reject`),
};

// Background Sync Job Polling (Section 35)
export const syncJobsApi = {
  getStatus: (jobId) => api.get(`/data-sync/jobs/${jobId}`),
};

export default api;


