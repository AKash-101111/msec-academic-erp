import { useNavigate } from 'react-router-dom';
import { Users, AlertTriangle, TrendingDown, Upload, ChevronRight } from 'lucide-react';
import { Card, StatCard } from '../../components/UI/Card';
import { useAdminDashboard } from '../../services/queries';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { data, isLoading } = useAdminDashboard();
    
    const stats = data?.data || null;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-800 rounded w-48 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-slate-800 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                    <p className="text-slate-400 mt-1">Welcome back! Here's your institution overview.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/upload')}
                    className="btn-primary flex items-center gap-2"
                >
                    <Upload size={18} />
                    Upload Data
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Students"
                    value={stats?.totalStudents || 0}
                    icon={Users}
                    color="primary"
                />
                <StatCard
                    title="Attendance Shortage"
                    value={stats?.attendanceShortageCount || 0}
                    icon={AlertTriangle}
                    color="warning"
                />
                <StatCard
                    title="Performance Risk"
                    value={stats?.performanceRiskCount || 0}
                    icon={TrendingDown}
                    color="danger"
                />
                <StatCard
                    title="Batches Active"
                    value={stats?.studentsByBatch?.length || 0}
                    icon={Users}
                    color="accent"
                />
            </div>

            {/* Batch Distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-lg font-semibold text-white mb-4">Students by Batch</h2>
                    <div className="space-y-3">
                        {stats?.studentsByBatch?.map((batch) => (
                            <div key={batch.batch} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                <span className="text-white font-medium">{batch.batch}</span>
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-32 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full"
                                            style={{ width: `${(batch.count / (stats?.totalStudents || 1)) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-slate-400 text-sm w-8">{batch.count}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/admin/students')}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary-500/20">
                                    <Users className="w-5 h-5 text-primary-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-medium">View All Students</p>
                                    <p className="text-sm text-slate-400">Browse and filter student records</p>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-400 group-hover:text-white transition-colors" />
                        </button>

                        <button
                            onClick={() => navigate('/admin/upload')}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent-500/20">
                                    <Upload className="w-5 h-5 text-accent-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-medium">Upload Academic Data</p>
                                    <p className="text-sm text-slate-400">Import marks and attendance from Excel</p>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-400 group-hover:text-white transition-colors" />
                        </button>

                        <button
                            onClick={() => navigate('/admin/students?filter=risk')}
                            className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/20">
                                    <AlertTriangle className="w-5 h-5 text-red-400" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-medium">At-Risk Students</p>
                                    <p className="text-sm text-slate-400">View students needing attention</p>
                                </div>
                            </div>
                            <ChevronRight className="text-slate-400 group-hover:text-white transition-colors" />
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
