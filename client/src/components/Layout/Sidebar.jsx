import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Upload,
    GraduationCap,
    Calendar,
    Trophy,
    BarChart3,
    LogOut,
    Menu,
    X,
    BookOpen
} from 'lucide-react';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminLinks = [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { to: '/admin/students', icon: Users, label: 'Students' },
        { to: '/admin/upload', icon: Upload, label: 'Upload Data' }
    ];

    const studentLinks = [
        { to: '/student', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { to: '/student/academics', icon: GraduationCap, label: 'Academics' },
        { to: '/student/attendance', icon: Calendar, label: 'Attendance' },
        { to: '/student/activities', icon: Trophy, label: 'Activities' },
        { to: '/student/analytics', icon: BarChart3, label: 'Analytics' }
    ];

    const links = user?.role === 'ADMIN' ? adminLinks : studentLinks;

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-slate-800 text-white shadow-lg"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-slate-900/95 backdrop-blur-xl
          border-r border-slate-800
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25">
                                <BookOpen className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">MSEC ERP</h1>
                                <p className="text-xs text-slate-400">Academic Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.exact}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-primary-600/20 text-primary-400 shadow-lg shadow-primary-500/10'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                    }`
                                }
                            >
                                <link.icon size={20} />
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center gap-3 mb-4 px-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-slate-400 truncate">
                                    {user?.role === 'ADMIN' ? 'Administrator' : user?.studentProfile?.rollNumber}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all duration-200"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
