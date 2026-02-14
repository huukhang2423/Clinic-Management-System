import api from './api';

const patientService = {
  getAll: (search = '') => api.get(`/patients${search ? `?search=${search}` : ''}`),
  getNames: (q) => api.get(`/patients/names?q=${encodeURIComponent(q)}`),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
  addVisit: (id, data) => api.post(`/patients/${id}/visits`, data),
};

export default patientService;
