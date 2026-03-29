import api from './api';

export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats'),
    getCharts: () => api.get('/dashboard/charts'),
};