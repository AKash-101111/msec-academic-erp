import { useAuth } from '../../context/AuthContext';
import { IconBell, IconSearch } from '@tabler/icons-react';
import DarkModeToggle from '../UI/DarkModeToggle';

export default function Header() {
    const { user, logout } = useAuth();

    return (
<<<<<<< HEAD
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-primary-900/80 backdrop-blur-xl border-b border-primary-200 dark:border-primary-800 transition-colors">
=======
        <header className="sticky top-0 z-30 bg-lavender/80 backdrop-blur-xl border-b border-amethyst/30">
>>>>>>> 48ffff9 (Royal Amethyst theme + login UI update)
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left section */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400 dark:text-primary-500" stroke={2} />
                        <input
                            type="text"
                            placeholder="Search..."
<<<<<<< HEAD
                            className="w-full pl-10 pr-4 py-2.5 bg-primary-50 dark:bg-primary-800/50 border border-primary-200 dark:border-primary-700 rounded-xl text-primary-900 dark:text-white placeholder-primary-400 dark:placeholder-primary-500 focus:outline-none focus:ring-2 focus:ring-secondary-500/50 focus:border-secondary-500 transition-all"
=======
                            className="w-full pl-10 pr-4 py-2.5 bg-white/50 border border-amethyst/50 rounded-xl text-plum placeholder-plum/40 focus:outline-none focus:ring-2 focus:ring-royal/50 focus:border-royal transition-all"
>>>>>>> 48ffff9 (Royal Amethyst theme + login UI update)
                        />
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-3 ml-4">
                    {/* Dark Mode Toggle */}
                    <DarkModeToggle />

                    {/* Notifications */}
<<<<<<< HEAD
                    <button className="relative p-2 rounded-xl text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-white hover:bg-primary-100 dark:hover:bg-primary-800 transition-all">
                        <IconBell size={20} stroke={2} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                    </button>

                    {/* User badge */}
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-primary-50 dark:bg-primary-800/50 border border-primary-200 dark:border-primary-700">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-primary-900 dark:text-white">{user?.name}</p>
                            <p className="text-xs text-primary-600 dark:text-primary-400">
=======
                    <button className="relative p-2 rounded-xl text-plum/60 hover:text-royal hover:bg-royal/10 transition-all">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                    </button>

                    {/* User badge */}
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-xl bg-white/50 border border-amethyst/30">
                        <div className="w-8 h-8 rounded-full bg-royal flex items-center justify-center text-white font-semibold text-sm">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-plum">{user?.name}</p>
                            <p className="text-xs text-plum/60">
>>>>>>> 48ffff9 (Royal Amethyst theme + login UI update)
                                {user?.role === 'ADMIN' ? 'Admin' : 'Student'}
                            </p>
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-lg hover:shadow-xl"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </header>
    );
}

