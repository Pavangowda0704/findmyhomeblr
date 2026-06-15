import api from '../api/axiosInstance';

export const propertyService = {
  getProperties: (params) => api.get('/properties', { params }),
  getProperty: (id) => api.get(`/properties/${id}`),
  getPropertyBySlug: (slug) => api.get(`/properties/slug/${slug}`),
  getFeatured: () => api.get('/properties/featured'),
  getSimilar: (id) => api.get(`/properties/${id}/similar`),
  createProperty: (data) => api.post('/properties', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  deleteImage: (id, publicId) => api.delete(`/properties/${id}/images/${encodeURIComponent(publicId)}`)
};
