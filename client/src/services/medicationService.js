import api from './api';

const medicationService = {
  getAll: (search = '') => api.get(`/medications${search ? `?search=${search}` : ''}`),
  getById: (id) => api.get(`/medications/${id}`),
  create: (data) => api.post('/medications', data),
  update: (id, data) => api.put(`/medications/${id}`, data),
  delete: (id) => api.delete(`/medications/${id}`),
};

export default medicationService;
