import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { lazy, Suspense } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

// Auth Pages (eager loaded for faster initial login)
import Login from './pages/Auth/Login';

// Layout (eager loaded as it's always needed)
import MainLayout from './components/Layout/MainLayout';

// Lazy load all other pages for better performance
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const StudentList = lazy(() => import('./pages/Admin/StudentList'));
const StudentProfile = lazy(() => import('./pages/Admin/StudentProfile'));
const UploadData = lazy(() => import('./pages/Admin/UploadData'));

const StudentDashboard = lazy(() => import('./pages/Student/Dashboard'));
const Academics = lazy(() => import('./pages/Student/Academics'));
const Attendance = lazy(() => import('./pages/Student/Attendance'));
const Activities = lazy(() => import('./pages/Student/Activities'));
const Analytics = lazy(() => import('./pages/Student/Analytics'));

// Loading Spinner Component
function LoadingSpinner() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-app dark:bg-app-dark transition-colors">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
    );
}

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/student'} replace />;
    }

    return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;
}

function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/student'} replace /> : <Login />}
            />

            {/* Admin Routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<AdminDashboard />} />
                <Route path="students" element={<StudentList />} />
                <Route path="student/:id" element={<StudentProfile />} />
                <Route path="upload" element={<UploadData />} />
            </Route>

            {/* Student Routes */}
            <Route
                path="/student"
                element={
                    <ProtectedRoute allowedRoles={['STUDENT']}>
                        <MainLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<StudentDashboard />} />
                <Route path="academics" element={<Academics />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="activities" element={<Activities />} />
                <Route path="analytics" element={<Analytics />} />
            </Route>

            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <AuthProvider>
                    <AppRoutes />
                </AuthProvider>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
