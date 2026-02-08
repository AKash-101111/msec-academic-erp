import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { IconBook, IconEye, IconEyeOff, IconArrowRight } from '@tabler/icons-react';
import DarkModeToggle from '../../components/UI/DarkModeToggle';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            navigate(result.user.role === 'ADMIN' ? '/admin' : '/student');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-app dark:bg-app-dark flex items-center justify-center p-4 transition-colors relative">
            {/* Dark Mode Toggle - Top Right */}
            <div className="absolute top-6 right-6 z-10">
                <DarkModeToggle />
            </div>

            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary-500/20 dark:bg-secondary-600/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/20 dark:bg-accent-600/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary-500 to-secondary-700 shadow-xl shadow-secondary-500/25 mb-4">
                        <IconBook className="w-8 h-8 text-white" stroke={2} />
                    </div>
                    <h1 className="text-3xl font-bold text-primary-900 dark:text-white mb-2">MSEC Academic ERP</h1>
                    <p className="text-primary-600 dark:text-primary-400">Enterprise Student Lifecycle Management</p>
                </div>

                {/* Login Card */}
                <div className="glass-card p-8 shadow-xl">
                    <h2 className="text-xl font-semibold text-primary-900 dark:text-white mb-6">Sign in to your account</h2>

                    {error && (
                        <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-700 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@msec.edu.in"
                                required
                                className="input-field"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-primary-700 dark:text-primary-400 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="input-field pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-400 dark:text-primary-500 hover:text-primary-900 dark:hover:text-white transition-colors"
                                >
                                    {showPassword ? <IconEyeOff size={20} stroke={2} /> : <IconEye size={20} stroke={2} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                            ) : (
                                <>
                                    Sign In
                                    <IconArrowRight size={18} stroke={2} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 pt-6 border-t border-primary-200 dark:border-primary-700">
                        <p className="text-sm text-primary-600 dark:text-primary-400 mb-3 font-medium">Demo Credentials:</p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail('admin@msec.edu.in');
                                    setPassword('admin123');
                                }}
                                className="px-3 py-2 text-xs bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 rounded-lg text-primary-900 dark:text-primary-300 transition-colors font-medium"
                            >
                                Admin Login
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setEmail('student1@msec.edu.in');
                                    setPassword('student123');
                                }}
                                className="px-3 py-2 text-xs bg-primary-100 dark:bg-primary-800 hover:bg-primary-200 dark:hover:bg-primary-700 rounded-lg text-primary-900 dark:text-primary-300 transition-colors font-medium"
                            >
                                Student Login
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-sm text-primary-500 dark:text-primary-600 mt-6">
                    © 2024 MSEC Academic ERP. All rights reserved.
                </p>
            </div>
        </div>
    );
}
