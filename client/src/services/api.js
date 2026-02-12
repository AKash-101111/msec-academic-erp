import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 30000, // 30 second timeout
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

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor with automatic token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Don't retry refresh or login endpoints
            if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue the request while refreshing
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                const { data } = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    { refreshToken }
                );

                if (data.success) {
                    const newToken = data.data.token;
                    const newRefreshToken = data.data.refreshToken;

                    localStorage.setItem('token', newToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    processQueue(null, newToken);

                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
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
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 60000, // 60s for uploads
        });
    },
    uploadAttendance: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/admin/upload/attendance', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 60000,
        });
    },
    uploadActivities: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/admin/upload/activities', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            timeout: 60000,
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
    getInsights: (studentId) => api.get('/student/insights', { params: { studentId } }),
    downloadReport: (studentId) => api.get('/student/report/pdf', {
        params: { studentId },
        responseType: 'blob',
        timeout: 60000,
    })
};
