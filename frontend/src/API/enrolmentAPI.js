import api from './axios';

export const enrolmentAPI = {
    enrol: (data) => api.post('/enrolments', data),
    getMy: () => api.get('/enrolments/my'),
    getAll: () => api.get('/enrolments'),
    getStats: () => api.get('/enrolments/stats'),
    remove: (id) => api.delete(`/enrolments/${id}`),
};