import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Pages
import Login from './pages/Auth/Login';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import StudentList from './pages/Admin/StudentList';
import StudentProfile from './pages/Admin/StudentProfile';
import UploadData from './pages/Admin/UploadData';

// Student Pages
import StudentDashboard from './pages/Student/Dashboard';
import Academics from './pages/Student/Academics';
import Attendance from './pages/Student/Attendance';
import Activities from './pages/Student/Activities';
import Analytics from './pages/Student/Analytics';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/student'} replace />;
    }

    return children;
}

function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
        );
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
        <Router>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </Router>
    );
}

export default App;
