import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

export const campaignsAPI = {
  getAll: (params) => API.get('/campaigns', { params }),
  getById: (id) => API.get(`/campaigns/${id}`),
  create: (data) => API.post('/campaigns', data),
  update: (id, data) => API.put(`/campaigns/${id}`, data),
  addUpdate: (id, data) => API.post(`/campaigns/${id}/updates`, data),
};

export const donationsAPI = {
  donate: (data) => API.post('/donations', data),
  getMyDonations: () => API.get('/donations/my'),
  getReceipt: (id) => API.get(`/donations/${id}/receipt`),
  getAllAdmin: (params) => API.get('/donations/admin/all', { params }),
};

export const volunteersAPI = {
  getOpportunities: (params) => API.get('/volunteers/opportunities', { params }),
  getOpportunity: (id) => API.get(`/volunteers/opportunities/${id}`),
  createOpportunity: (data) => API.post('/volunteers/opportunities', data),
  apply: (id) => API.post(`/volunteers/apply/${id}`),
  getMyApplications: () => API.get('/volunteers/my-applications'),
  updateApplication: (id, data) => API.put(`/volunteers/applications/${id}`, data),
  getAllAdmin: () => API.get('/volunteers/admin/all'),
};

export const helpAPI = {
  submit: (formData) => API.post('/help-requests', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMy: () => API.get('/help-requests/my'),
  getAllAdmin: (params) => API.get('/help-requests/admin/all', { params }),
  review: (id, data) => API.put(`/help-requests/${id}/review`, data),
};

export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getUsers: (params) => API.get('/admin/users', { params }),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  getReports: () => API.get('/admin/reports'),
};

export const notificationsAPI = {
  getAll: () => API.get('/notifications'),
  readAll: () => API.put('/notifications/read-all'),
};

export default API;
