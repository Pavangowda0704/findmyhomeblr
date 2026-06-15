import api from '../api/axiosInstance';

export const leadService = {
  createLead: (data) => api.post('/leads', data),
  getLeads: (params) => api.get('/leads', { params }),
  getAgentLeads: (params) => api.get('/leads/agent', { params }),
  getMyEnquiries: () => api.get('/leads/my-enquiries'),
  getLead: (id) => api.get(`/leads/${id}`),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  addNote: (id, note) => api.post(`/leads/${id}/notes`, { note }),
  assignLead: (id, agentId) => api.put(`/leads/${id}/assign`, { agentId })
};
