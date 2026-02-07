import { useAuth } from '../../context/AuthContext';
import { Bell, Search } from 'lucide-react';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left section */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                        />
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-4 ml-4">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </button>

                    {/* User badge */}
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold text-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-slate-400">
                                {user?.role === 'ADMIN' ? 'Admin' : 'Student'}
                            </p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}
