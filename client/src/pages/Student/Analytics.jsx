import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card } from '../../components/UI/Card';
import { studentAPI } from '../../services/api';

export default function Analytics() {
    const [performanceTrend, setPerformanceTrend] = useState(null);
    const [attendanceTrend, setAttendanceTrend] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [perfRes, attRes] = await Promise.all([
                studentAPI.getPerformanceTrend(),
                studentAPI.getAttendanceTrend()
            ]);

            if (perfRes.data.success) {
                setPerformanceTrend(perfRes.data.data);
            }
            if (attRes.data.success) {
                setAttendanceTrend(attRes.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-slate-800 rounded w-48 mb-6" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-80 bg-lavender/50 border border-amethyst/20 rounded-xl" />
                        <div className="h-80 bg-lavender/50 border border-amethyst/20 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    const getTrendIcon = (direction) => {
        if (direction === 'improving') return <TrendingUp className="text-emerald-500" />;
        if (direction === 'declining') return <TrendingDown className="text-red-500" />;
        return <Minus className="text-plum/40" />;
    };

    const getTrendText = (direction) => {
        if (direction === 'improving') return 'Improving';
        if (direction === 'declining') return 'Needs Attention';
        return 'Stable';
    };

    const getTrendColor = (direction) => {
        if (direction === 'improving') return 'text-emerald-500';
        if (direction === 'declining') return 'text-red-500';
        return 'text-plum/40';
    };

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-plum">Performance Analytics</h1>
                <p className="text-plum/60 mt-1">Visualize your academic trends and insights</p>
            </div>

            {/* Trend Summary */}
            <Card>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-royal/10">
                            <BarChart3 className="w-6 h-6 text-royal" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-plum">Performance Trend</h2>
                            <p className="text-plum/60">Based on your year-wise GPA</p>
                        </div>
                    </div>
                    <div className={`flex items-center gap-2 ${getTrendColor(performanceTrend?.trendDirection)}`}>
                        {getTrendIcon(performanceTrend?.trendDirection)}
                        <span className="font-medium">{getTrendText(performanceTrend?.trendDirection)}</span>
                    </div>
                </div>
            </Card>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* GPA Trend Line Chart Chart */}
                <Card>
                    <h2 className="text-lg font-semibold text-plum mb-6">Academic Performance Trend</h2>
                    {performanceTrend?.trend?.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={performanceTrend.trend}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2D9F3" />
                                    <XAxis
                                        dataKey="year"
                                        stroke="#7A3F91"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        domain={[0, 10]}
                                        stroke="#7A3F91"
                                        fontSize={12}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#F2EAF7',
                                            border: '1px solid #C59DD9',
                                            borderRadius: '8px',
                                            color: '#2B0D3E'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="gpa"
                                        stroke="#7A3F91"
                                        strokeWidth={3}
                                        dot={{ fill: '#7A3F91', strokeWidth: 2, r: 6 }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-plum/40">
                            No performance data available
                        </div>
                    )}
                </Card>

                {/* Attendance Bar Chart */}
                <Card>
                    <h2 className="text-lg font-semibold text-plum mb-6">Subject-wise Attendance</h2>
                    {attendanceTrend?.subjects?.length > 0 ? (
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={attendanceTrend.subjects} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#E2D9F3" />
                                    <XAxis
                                        type="number"
                                        domain={[0, 100]}
                                        stroke="#7A3F91"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        stroke="#7A3F91"
                                        fontSize={10}
                                        width={100}
                                        tickFormatter={(value) => value.length > 15 ? value.substring(0, 15) + '...' : value}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#F2EAF7',
                                            border: '1px solid #C59DD9',
                                            borderRadius: '8px',
                                            color: '#2B0D3E'
                                        }}
                                        formatter={(value) => [`${value.toFixed(1)}%`, 'Attendance']}
                                    />
                                    <Bar
                                        dataKey="percentage"
                                        fill="#C59DD9"
                                        radius={[0, 4, 4, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-plum/40">
                            No attendance data available
                        </div>
                    )}
                </Card>
            </div>

            {/* Insights */}
            <Card>
                <h2 className="text-lg font-semibold text-plum mb-4">Insights & Recommendations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {performanceTrend?.trendDirection === 'declining' && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                            <h3 className="font-medium text-red-500 mb-2">📉 GPA Trend Alert</h3>
                            <p className="text-sm text-plum/60">
                                Your GPA has been declining. Consider reviewing your study habits and seeking academic support.
                            </p>
                        </div>
                    )}

                    {performanceTrend?.trendDirection === 'improving' && (
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <h3 className="font-medium text-emerald-600 mb-2">📈 Great Progress!</h3>
                            <p className="text-sm text-plum/60">
                                Your GPA is improving! Keep up the excellent work and maintain your current study routine.
                            </p>
                        </div>
                    )}

                    {attendanceTrend?.subjects?.some(s => s.percentage < 75) && (
                        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <h3 className="font-medium text-amber-600 mb-2">⚠️ Attendance Warning</h3>
                            <p className="text-sm text-plum/60">
                                Some subjects have attendance below 75%. Improve attendance to avoid academic restrictions.
                            </p>
                        </div>
                    )}

                    {attendanceTrend?.subjects?.every(s => s.percentage >= 75) && (
                        <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                            <h3 className="font-medium text-emerald-600 mb-2">✅ Healthy Attendance</h3>
                            <p className="text-sm text-plum/60">
                                Your attendance is above 75% in all subjects. Great job maintaining regular attendance!
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
