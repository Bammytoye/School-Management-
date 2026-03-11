import api from "./api";

export const gradesAPI = {
    getAll: (params) => api.get('/grades', { params }),
    setGrade: (data) => api.post('/grades', data),
    getMy: () => api.get('/grades/my'),
};

export const attendanceAPI = {
    getAll: (params) => api.get('/attendance', { params }),
    mark: (data) => api.post('/attendance', data),
    getMy: () => api.get('/attendance/my'),
};