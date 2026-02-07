import { useState, useEffect } from 'react';
import { Calendar, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import AttendanceGauge from '../../components/UI/AttendanceGauge';
import { studentAPI } from '../../services/api';

export default function Attendance() {
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const response = await studentAPI.getAttendance();
            if (response.data.success) {
                setAttendance(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-800 rounded w-48 mb-6" />
                    <div className="h-48 bg-slate-800 rounded-xl mb-6" />
                    <div className="grid grid-cols-2 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-24 bg-slate-800 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const getStatusColor = (pct) => {
        if (pct >= 75) return { bg: 'bg-emerald-500', text: 'text-emerald-400', bgFaded: 'bg-emerald-500/20' };
        if (pct >= 60) return { bg: 'bg-amber-500', text: 'text-amber-400', bgFaded: 'bg-amber-500/20' };
        return { bg: 'bg-red-500', text: 'text-red-400', bgFaded: 'bg-red-500/20' };
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Attendance Tracker</h1>
                <p className="text-slate-400 mt-1">Subject-wise attendance records and analysis</p>
            </div>

            {/* Overall Attendance */}
            <Card>
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <AttendanceGauge percentage={attendance?.overall || 0} size="lg" />
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white mb-2">Overall Attendance</h2>
                        <p className={`text-4xl font-bold ${getStatusColor(attendance?.overall || 0).text}`}>
                            {attendance?.overall?.toFixed(1) || 0}%
                        </p>
                        {attendance?.shortageWarning ? (
                            <div className="flex items-center gap-2 mt-3 text-amber-400">
                                <AlertTriangle size={18} />
                                <span>You are below the required 75% attendance</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mt-3 text-emerald-400">
                                <CheckCircle size={18} />
                                <span>Your attendance is healthy</span>
                            </div>
                        )}
                    </div>
                    <div className="flex gap-6">
                        <div className="text-center">
                            <div className="w-4 h-4 rounded-full bg-emerald-500 mx-auto mb-2" />
                            <p className="text-xs text-slate-400">&gt;75%</p>
                            <p className="text-sm font-medium text-white">Good</p>
                        </div>
                        <div className="text-center">
                            <div className="w-4 h-4 rounded-full bg-amber-500 mx-auto mb-2" />
                            <p className="text-xs text-slate-400">60-75%</p>
                            <p className="text-sm font-medium text-white">Warning</p>
                        </div>
                        <div className="text-center">
                            <div className="w-4 h-4 rounded-full bg-red-500 mx-auto mb-2" />
                            <p className="text-xs text-slate-400">&lt;60%</p>
                            <p className="text-sm font-medium text-white">Critical</p>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Shortage Warning */}
            {attendance?.shortageSubjects?.length > 0 && (
                <Card className="border-amber-500/30 bg-amber-500/5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="text-amber-400 flex-shrink-0" size={24} />
                        <div>
                            <h3 className="text-lg font-semibold text-amber-400">Attendance Shortage Alert</h3>
                            <p className="text-slate-400 mt-1">
                                You have attendance shortage in {attendance.shortageSubjects.length} subject(s):
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {attendance.shortageSubjects.map((subject, idx) => (
                                    <span key={idx} className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-sm">
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Subject-wise Attendance */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Subject-wise Breakdown</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {attendance?.subjects?.map((subject) => {
                        const color = getStatusColor(subject.attendancePercent);
                        return (
                            <Card key={subject.id} hover>
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${color.bgFaded}`}>
                                            <Calendar className={`w-5 h-5 ${color.text}`} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white">{subject.subjectName}</h3>
                                            {subject.totalClasses && (
                                                <p className="text-xs text-slate-400">
                                                    {subject.attendedClasses || 0} / {subject.totalClasses} classes
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`text-2xl font-bold ${color.text}`}>
                                        {subject.attendancePercent.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${color.bg}`}
                                        style={{ width: `${Math.min(subject.attendancePercent, 100)}%` }}
                                    />
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            {(!attendance?.subjects || attendance.subjects.length === 0) && (
                <Card className="text-center py-12">
                    <Calendar className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                    <p className="text-slate-400">No attendance records available</p>
                </Card>
            )}
        </div>
    );
}
