import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// Admin API functions
export const adminAPI = {
    getDashboard: () => api.get('/admin/dashboard'),
    getStudents: (params) => api.get('/admin/students', { params }),
    getStudent: (id) => api.get(`/admin/student/${id}`),
    getBatches: () => api.get('/admin/batches'),
    getDepartments: () => api.get('/admin/departments'),
    uploadAcademics: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/admin/upload/academics', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadAttendance: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/admin/upload/attendance', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
    uploadActivities: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/admin/upload/activities', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    }
};

// Student API functions
export const studentAPI = {
    getProfile: (studentId) => api.get('/student/profile', { params: { studentId } }),
    getAttendance: (studentId) => api.get('/student/attendance', { params: { studentId } }),
    getActivities: (studentId) => api.get('/student/activities', { params: { studentId } }),
    getPerformanceTrend: (studentId) => api.get('/student/performance-trend', { params: { studentId } }),
    getAttendanceTrend: (studentId) => api.get('/student/attendance-trend', { params: { studentId } }),
    downloadReport: (studentId) => api.get('/student/report/pdf', {
        params: { studentId },
        responseType: 'blob'
    })
};
