import api from '../api/axiosInstance';

export const userService = {
  updateProfile: (data) => api.put('/users/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSavedProperties: () => api.get('/users/saved'),
  saveProperty: (propertyId) => api.post(`/users/saved/${propertyId}`),
  getCompareList: () => api.get('/users/compare'),
  toggleCompare: (propertyId) => api.post(`/users/compare/${propertyId}`)
};
