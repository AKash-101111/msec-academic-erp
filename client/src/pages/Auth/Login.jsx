import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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

    const FeatureItem = ({ icon: Icon, text }) => (
        <div className="flex items-center gap-4 text-plum/80 group">
            <div className="p-2 rounded-lg bg-royal/10 group-hover:bg-royal/20 transition-colors">
                <Icon size={24} className="text-royal" />
            </div>
            <span className="text-lg font-medium tracking-wide">{text}</span>
        </div>
    );

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
                        </div>
                        <h1 className="text-5xl font-bold text-plum mb-3 tracking-tight">
                            MSEC Academic ERP
                        </h1>
                        <p className="text-xl text-plum/70 font-light tracking-wide">
                            Enterprise Student Lifecycle Management
                        </p>
                    </div>

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
                                        autoComplete="email"
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
                                        autoComplete="current-password"
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
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-8 text-plum/40 text-sm">
                        Need help? <a href="#" className="text-royal hover:text-royal/80 font-medium hover:underline">Contact Support</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

