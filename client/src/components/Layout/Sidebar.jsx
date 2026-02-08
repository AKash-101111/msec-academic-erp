import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    IconLayoutDashboard,
    IconUsers,
    IconUpload,
    IconSchool,
    IconCalendar,
    IconTrophy,
    IconChartBar,
    IconLogout,
    IconMenu2,
    IconX,
    IconBook
} from '@tabler/icons-react';

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminLinks = [
        { to: '/admin', icon: IconLayoutDashboard, label: 'Dashboard', exact: true },
        { to: '/admin/students', icon: IconUsers, label: 'Students' },
        { to: '/admin/upload', icon: IconUpload, label: 'Upload Data' }
    ];

    const studentLinks = [
        { to: '/student', icon: IconLayoutDashboard, label: 'Dashboard', exact: true },
        { to: '/student/academics', icon: IconSchool, label: 'Academics' },
        { to: '/student/attendance', icon: IconCalendar, label: 'Attendance' },
        { to: '/student/activities', icon: IconTrophy, label: 'Activities' },
        { to: '/student/analytics', icon: IconChartBar, label: 'Analytics' }
    ];

    const links = user?.role === 'ADMIN' ? adminLinks : studentLinks;

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary-800 dark:bg-primary-900 text-white shadow-lg"
            >
                {isOpen ? <IconX size={24} stroke={2} /> : <IconMenu2 size={24} stroke={2} />}
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
          w-72 bg-white/95 dark:bg-primary-900/95 backdrop-blur-xl
          border-r border-primary-200 dark:border-primary-800
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-primary-200 dark:border-primary-800">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center shadow-lg shadow-secondary-500/25">
                                <IconBook className="w-5 h-5 text-white" stroke={2} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-primary-900 dark:text-white">MSEC ERP</h1>
                                <p className="text-xs text-primary-500 dark:text-primary-400">Academic Portal</p>
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
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                                        ? 'bg-secondary-500/10 dark:bg-secondary-600/20 text-secondary-600 dark:text-secondary-400 shadow-lg shadow-secondary-500/10'
                                        : 'text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white hover:bg-primary-100 dark:hover:bg-primary-800/50'
                                    }`
                                }
                            >
                                <link.icon size={20} stroke={2} />
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-primary-200 dark:border-primary-800">
                        <div className="flex items-center gap-3 mb-4 px-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center text-white font-semibold shadow-lg">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-primary-900 dark:text-white truncate">
                                    {user?.name || 'User'}
                                </p>
                                <p className="text-xs text-primary-600 dark:text-primary-400 truncate">
                                    {user?.role === 'ADMIN' ? 'Administrator' : user?.studentProfile?.rollNumber}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/10 transition-all duration-200"
                        >
                            <IconLogout size={20} stroke={2} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
