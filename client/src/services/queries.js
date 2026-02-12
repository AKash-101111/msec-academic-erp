import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { adminAPI, studentAPI } from './api';

// Query Keys
export const queryKeys = {
    adminDashboard: ['admin', 'dashboard'],
    students: (params) => ['admin', 'students', params],
    student: (id) => ['admin', 'student', id],
    batches: ['admin', 'batches'],
    departments: ['admin', 'departments'],
    studentProfile: (id) => ['student', 'profile', id],
    studentAttendance: (id) => ['student', 'attendance', id],
    studentActivities: (id) => ['student', 'activities', id],
    performanceTrend: (id) => ['student', 'performance-trend', id],
    attendanceTrend: (id) => ['student', 'attendance-trend', id],
};

// Admin Hooks
export function useAdminDashboard() {
    return useQuery({
        queryKey: queryKeys.adminDashboard,
        queryFn: async () => {
            const { data } = await adminAPI.getDashboard();
            return data;
        },
    });
}

export function useStudents(params = {}) {
    return useQuery({
        queryKey: queryKeys.students(params),
        queryFn: async () => {
            const { data } = await adminAPI.getStudents(params);
            return data;
        },
        placeholderData: keepPreviousData, // v5 replacement for keepPreviousData: true
    });
}


export function useStudent(id) {
    return useQuery({
        queryKey: queryKeys.student(id),
        queryFn: async () => {
            const { data } = await adminAPI.getStudent(id);
            return data;
        },
        enabled: !!id, // Only run query if id exists
    });
}

export function useBatches() {
    return useQuery({
        queryKey: queryKeys.batches,
        queryFn: async () => {
            const { data } = await adminAPI.getBatches();
            return data;
        },
        staleTime: 30 * 60 * 1000, // Batches rarely change, cache for 30 minutes
    });
}

export function useDepartments() {
    return useQuery({
        queryKey: queryKeys.departments,
        queryFn: async () => {
            const { data } = await adminAPI.getDepartments();
            return data;
        },
        staleTime: 30 * 60 * 1000, // Departments rarely change, cache for 30 minutes
    });
}

// Upload mutations
export function useUploadAcademics() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file) => adminAPI.uploadAcademics(file),
        onSuccess: () => {
            // Invalidate related queries to refetch data
            queryClient.invalidateQueries({ queryKey: ['admin'] });
            queryClient.invalidateQueries({ queryKey: ['student'] });
        },
    });
}

export function useUploadAttendance() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file) => adminAPI.uploadAttendance(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin'] });
            queryClient.invalidateQueries({ queryKey: ['student'] });
        },
    });
}

export function useUploadActivities() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file) => adminAPI.uploadActivities(file),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin'] });
            queryClient.invalidateQueries({ queryKey: ['student'] });
        },
    });
}

// Student Hooks
export function useStudentProfile(studentId) {
    return useQuery({
        queryKey: queryKeys.studentProfile(studentId),
        queryFn: async () => {
            const { data } = await studentAPI.getProfile(studentId);
            return data;
        },
        enabled: !!studentId,
    });
}

export function useStudentAttendance(studentId) {
    return useQuery({
        queryKey: queryKeys.studentAttendance(studentId),
        queryFn: async () => {
            const { data } = await studentAPI.getAttendance(studentId);
            return data;
        },
        enabled: !!studentId,
    });
}

export function useStudentActivities(studentId) {
    return useQuery({
        queryKey: queryKeys.studentActivities(studentId),
        queryFn: async () => {
            const { data } = await studentAPI.getActivities(studentId);
            return data;
        },
        enabled: !!studentId,
    });
}

export function usePerformanceTrend(studentId) {
    return useQuery({
        queryKey: queryKeys.performanceTrend(studentId),
        queryFn: async () => {
            const { data } = await studentAPI.getPerformanceTrend(studentId);
            return data;
        },
        enabled: !!studentId,
    });
}

export function useAttendanceTrend(studentId) {
    return useQuery({
        queryKey: queryKeys.attendanceTrend(studentId),
        queryFn: async () => {
            const { data } = await studentAPI.getAttendanceTrend(studentId);
            return data;
        },
        enabled: !!studentId,
    });
}
