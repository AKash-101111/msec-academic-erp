import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Calendar, Trophy, BarChart3, Download, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Card, StatCard } from '../../components/UI/Card';
import AttendanceGauge from '../../components/UI/AttendanceGauge';
import { studentAPI } from '../../services/api';

export default function StudentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await studentAPI.getProfile();
            if (response.data.success) {
                setProfile(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async () => {
        setDownloading(true);
        try {
            const response = await studentAPI.downloadReport();
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${profile?.profile?.rollNumber || 'report'}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Failed to download report:', error);
        } finally {
            setDownloading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-800 rounded w-64 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-32 bg-slate-800 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const currentGpa = profile?.academics?.[profile.academics.length - 1]?.gpa;
    const overallAttendance = profile?.attendance?.overall;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Welcome Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Welcome back, {profile?.profile?.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {profile?.profile?.rollNumber} • {profile?.profile?.department} • {profile?.profile?.batch}
                    </p>
                </div>
                <button
                    onClick={downloadReport}
                    disabled={downloading}
                    className="btn-primary flex items-center gap-2"
                >
                    {downloading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                    ) : (
                        <>
                            <Download size={18} />
                            Download Report
                        </>
                    )}
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Current GPA"
                    value={currentGpa?.toFixed(2) || '-'}
                    icon={GraduationCap}
                    color="primary"
                />
                <Card className="flex items-center gap-4">
                    <AttendanceGauge percentage={overallAttendance || 0} size="md" />
                    <div>
                        <p className="text-sm text-slate-400">Overall Attendance</p>
                        <p className="text-2xl font-bold text-white">{overallAttendance?.toFixed(1) || 0}%</p>
                        {overallAttendance && overallAttendance < 75 && (
                            <p className="text-xs text-amber-400 mt-1">⚠️ Below required 75%</p>
                        )}
                    </div>
                </Card>
                <StatCard
                    title="Years Completed"
                    value={profile?.academics?.length || 0}
                    icon={Calendar}
                    color="accent"
                />
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-lg font-semibold text-white mb-4">Quick Access</h2>
                    <div className="space-y-3">
                        {[
                            { to: '/student/academics', icon: GraduationCap, label: 'View Academics', desc: 'Year-wise academic records', color: 'primary' },
                            { to: '/student/attendance', icon: Calendar, label: 'Attendance Tracker', desc: 'Subject-wise attendance', color: 'accent' },
                            { to: '/student/activities', icon: Trophy, label: 'Activities & Achievements', desc: 'Holistic development profile', color: 'warning' },
                            { to: '/student/analytics', icon: BarChart3, label: 'Performance Analytics', desc: 'Trends and insights', color: 'danger' }
                        ].map((item) => (
                            <button
                                key={item.to}
                                onClick={() => navigate(item.to)}
                                className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-${item.color}-500/20`}>
                                        <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-white font-medium">{item.label}</p>
                                        <p className="text-sm text-slate-400">{item.desc}</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-400 group-hover:text-white transition-colors" />
                            </button>
                        ))}
                    </div>
                </Card>

                {/* Recent Academic Summary */}
                <Card>
                    <h2 className="text-lg font-semibold text-white mb-4">Academic Summary</h2>
                    {profile?.academics?.length > 0 ? (
                        <div className="space-y-4">
                            {profile.academics.map((year) => (
                                <div key={year.year} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                                    <span className="text-white font-medium">Year {year.year}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-slate-400">{year.subjects?.length || 0} subjects</span>
                                        <span className={`text-lg font-bold ${year.gpa >= 8 ? 'text-emerald-400' :
                                                year.gpa >= 6 ? 'text-amber-400' : 'text-red-400'
                                            }`}>
                                            {year.gpa?.toFixed(2) || '-'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-400 text-center py-8">No academic records yet</p>
                    )}
                </Card>
            </div>

            {/* Attendance Warnings */}
            {profile?.attendance?.subjects?.some(s => s.attendancePercent < 75) && (
                <Card className="border-amber-500/30">
                    <h2 className="text-lg font-semibold text-amber-400 mb-4">⚠️ Attendance Alerts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {profile.attendance.subjects
                            .filter(s => s.attendancePercent < 75)
                            .map((subject) => (
                                <div key={subject.id} className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                                    <p className="text-white font-medium truncate">{subject.subjectName}</p>
                                    <p className={`text-sm ${subject.attendancePercent < 60 ? 'text-red-400' : 'text-amber-400'}`}>
                                        {subject.attendancePercent.toFixed(1)}% attendance
                                    </p>
                                </div>
                            ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
