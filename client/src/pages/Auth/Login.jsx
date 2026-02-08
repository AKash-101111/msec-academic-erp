import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
<<<<<<< HEAD
import { IconBook, IconEye, IconEyeOff, IconArrowRight } from '@tabler/icons-react';
import DarkModeToggle from '../../components/UI/DarkModeToggle';
=======
import {
    Eye,
    EyeOff,
    ArrowRight,
    Activity,
    Award,
    FileText,
    LayoutDashboard
} from 'lucide-react';

import campusBg from '/image.png';

>>>>>>> 48ffff9 (Royal Amethyst theme + login UI update)

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

<<<<<<< HEAD
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
=======
    const FeatureItem = ({ icon: Icon, text }) => (
        <div className="flex items-center gap-4 text-plum/80 group">
            <div className="p-2 rounded-lg bg-royal/10 group-hover:bg-royal/20 transition-colors">
                <Icon size={24} className="text-royal" />
>>>>>>> 48ffff9 (Royal Amethyst theme + login UI update)
            </div>
            <span className="text-lg font-medium tracking-wide">{text}</span>
        </div>
    );

<<<<<<< HEAD
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
=======
    return (
        <div className="min-h-screen flex font-sans">
            {/* LEFT SIDE - College Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-lavender">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src={campusBg}
                        alt="MSEC Campus"
                        className="w-full h-full object-cover blur-[2px]"
                    />
                    {/* Gradient Overlay: rgba(242,234,247,0.85) to rgba(242,234,247,0.4) matches lavender #F2EAF7 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-lavender/90 to-lavender/40 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-r from-lavender/90 to-lavender/40" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 w-full h-full p-16 flex flex-col justify-between">
                    {/* Top Branding */}
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-md flex items-center justify-center border border-white/50 shadow-lg shadow-royal/5 p-2">
                                <img src="/favicon.ico" alt="MSEC Logo" className="w-full h-full object-contain" />
                            </div>
>>>>>>> 48ffff9 (Royal Amethyst theme + login UI update)
                        </div>
                        <h1 className="text-5xl font-bold text-plum mb-3 tracking-tight">
                            MSEC Academic ERP
                        </h1>
                        <p className="text-xl text-plum/70 font-light tracking-wide">
                            Enterprise Student Lifecycle Management
                        </p>
                    </div>

<<<<<<< HEAD
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
=======
                    {/* Feature List */}
                    <div className="space-y-6 pl-2">
                        <FeatureItem icon={Activity} text="Academic Performance Tracking" />
                        <FeatureItem icon={LayoutDashboard} text="Attendance & Engagement Analytics" />
                        <FeatureItem icon={Award} text="Internships & Achievements Tracking" />
                        <FeatureItem icon={FileText} text="Real-Time Student Reports" />
                    </div>

                    {/* Footer */}
                    <div className="text-plum/50 text-sm">
                        © {new Date().getFullYear()} MSEC. Built for excellence.
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE - Login Section */}
            <div className="w-full lg:w-1/2 bg-lavender flex items-center justify-center p-8 relative">
                <div className="w-full max-w-[480px] animate-fade-in-up">

                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(122,63,145,0.15)] p-10 relative overflow-hidden">
                        <div className="mb-10 text-center">
                            <h2 className="text-2xl font-bold text-plum mb-2">
                                Sign in to your account
                            </h2>
                            <p className="text-slate-500 text-sm">
                                Welcome back! Please enter your details.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-plum/80 ml-1">
                                    Email
                                </label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="admin@msec.edu.in"
                                        required
                                        className="w-full bg-lavender/30 px-4 py-3.5 pl-5 rounded-xl border border-amethyst/50 text-plum placeholder:text-plum/30 focus:outline-none focus:border-royal focus:ring-1 focus:ring-royal transition-all duration-300 shadow-inner group-hover:border-amethyst"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-plum/80 ml-1">
                                    Password
                                </label>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full bg-lavender/30 px-4 py-3.5 pl-5 rounded-xl border border-amethyst/50 text-plum placeholder:text-plum/30 focus:outline-none focus:border-royal focus:ring-1 focus:ring-royal transition-all duration-300 shadow-inner group-hover:border-amethyst pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-plum/40 hover:text-royal transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-royal hover:bg-royal/90 text-white font-semibold py-4 rounded-xl shadow-lg shadow-royal/20 hover:shadow-royal/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Demo/Secondary Buttons */}
                        <div className="mt-8 pt-8 border-t border-lavender">
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmail('admin@msec.edu.in');
                                        setPassword('admin123');
                                    }}
                                    className="px-4 py-2.5 text-sm font-medium text-royal border border-royal/70 rounded-lg hover:bg-lavender transition-colors"
                                >
                                    Admin Login
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmail('student1@msec.edu.in');
                                        setPassword('student123');
                                    }}
                                    className="px-4 py-2.5 text-sm font-medium text-royal border border-royal/70 rounded-lg hover:bg-lavender transition-colors"
                                >
                                    Student Login
>>>>>>> 48ffff9 (Royal Amethyst theme + login UI update)
                                </button>
                            </div>
                        </div>
                    </div>

<<<<<<< HEAD
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
=======
                    <div className="text-center mt-8 text-plum/40 text-sm">
                        Need help? <a href="#" className="text-royal hover:text-royal/80 font-medium hover:underline">Contact Support</a>
                    </div>
                </div>
>>>>>>> 48ffff9 (Royal Amethyst theme + login UI update)
            </div>
        </div>
    );
}

