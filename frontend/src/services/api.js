import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to requests
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

// Centralized error response handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-logout'));
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Complaint API endpoints
export const complaintAPI = {
  create: (data) => api.post('/complaints', data),
  getMyComplaints: (params) => api.get('/complaints/my', { params }),
  getAllComplaints: (params) => api.get('/complaints', { params }),
  getById: (id) => api.get(`/complaints/${id}`),
  updateStatus: (id, data) => api.put(`/complaints/${id}/status`, data),
  delete: (id) => api.delete(`/complaints/${id}`),
};

// User Management API endpoints (Admin)
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  approve: (id) => api.put(`/users/${id}/approve`),
  reject: (id) => api.put(`/users/${id}/reject`),
  toggleStatus: (id) => api.put(`/users/${id}/toggle-status`),
  updateRole: (id, data) => api.put(`/users/${id}/role`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Stats & Analytics API endpoints
export const statsAPI = {
  getAdminStats: () => api.get('/stats/admin'),
  getUserStats: () => api.get('/stats/user'),
};

export default api;
