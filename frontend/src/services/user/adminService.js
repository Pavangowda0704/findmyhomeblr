import api from '../api/axiosInstance';

export const adminService = {
  getDashboard: () => api.get('/admin/dashboard'),
  getAnalytics: () => api.get('/admin/analytics'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  verifyProperty: (id, verified) => api.put(`/admin/properties/${id}/verify`, { verified }),
  featureProperty: (id, featured) => api.put(`/admin/properties/${id}/feature`, { featured }),
  // Agent applications
  getApplications: (params) => api.get('/agent-applications', { params }),
  approveApplication: (id) => api.put(`/agent-applications/${id}/approve`),
  rejectApplication: (id, reason) => api.put(`/agent-applications/${id}/reject`, { reason }),
};