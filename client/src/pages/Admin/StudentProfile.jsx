import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Mail, Phone, User, BookOpen, Calendar, Trophy } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import AttendanceGauge from '../../components/UI/AttendanceGauge';
import { adminAPI, studentAPI } from '../../services/api';

export default function StudentProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        try {
            const response = await adminAPI.getStudent(id);
            if (response.data.success) {
                setStudent(response.data.data.student);
            }
        } catch (error) {
            console.error('Failed to fetch student:', error);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async () => {
        setDownloading(true);
        try {
            const response = await studentAPI.downloadReport(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${student.rollNumber}_report.pdf`);
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
                    <div className="h-8 bg-slate-800 rounded w-48 mb-6" />
                    <div className="h-64 bg-slate-800 rounded-xl" />
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-400">Student not found</p>
            </div>
        );
    }

    const overallAttendance = student.attendances?.length > 0
        ? student.attendances.reduce((sum, a) => sum + a.attendancePercent, 0) / student.attendances.length
        : 0;

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{student.user.name}</h1>
                        <p className="text-slate-400">{student.rollNumber} • {student.department}</p>
                    </div>
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

            {/* Personal Info & Attendance Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <User size={20} className="text-primary-400" />
                        Personal Information
                    </h2>
                    <div className="space-y-3 text-sm">
                        <InfoRow label="Roll Number" value={student.rollNumber} />
                        <InfoRow label="Department" value={student.department} />
                        <InfoRow label="Batch" value={student.batch} />
                        <InfoRow label="Blood Group" value={student.bloodGroup || 'N/A'} />
                        <InfoRow label="Contact" value={student.contact || 'N/A'} icon={<Phone size={14} />} />
                        <InfoRow label="Email" value={student.user.email} icon={<Mail size={14} />} />
                    </div>
                </Card>

                <Card className="lg:col-span-2">
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Calendar size={20} className="text-accent-400" />
                        Attendance Overview
                    </h2>
                    <div className="flex items-center gap-8">
                        <AttendanceGauge percentage={overallAttendance} size="lg" />
                        <div className="flex-1">
                            <p className="text-sm text-slate-400 mb-3">Subject-wise Attendance</p>
                            <div className="grid grid-cols-2 gap-2">
                                {student.attendances?.slice(0, 6).map((att) => (
                                    <div key={att.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50">
                                        <span className="text-xs text-slate-400 truncate flex-1">{att.subjectName}</span>
                                        <span className={`text-xs font-medium ml-2 ${att.attendancePercent >= 75 ? 'text-emerald-400' :
                                                att.attendancePercent >= 60 ? 'text-amber-400' : 'text-red-400'
                                            }`}>
                                            {att.attendancePercent.toFixed(0)}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Academic Records */}
            <Card>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <BookOpen size={20} className="text-primary-400" />
                    Academic Records
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {student.academicYears?.map((year) => (
                        <div key={year.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-primary-400 font-semibold">Year {year.year}</span>
                                <span className="text-2xl font-bold text-white">{year.gpa?.toFixed(2) || '-'}</span>
                            </div>
                            <div className="space-y-1">
                                {year.subjectMarks?.slice(0, 4).map((subject) => (
                                    <div key={subject.id} className="flex justify-between text-xs">
                                        <span className="text-slate-400 truncate flex-1">{subject.subjectName}</span>
                                        <span className="text-slate-300 ml-2">{subject.marks?.toFixed(0) || '-'}</span>
                                    </div>
                                ))}
                                {year.subjectMarks?.length > 4 && (
                                    <p className="text-xs text-slate-500">+{year.subjectMarks.length - 4} more subjects</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Activities */}
            {student.activities && (
                <Card>
                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Trophy size={20} className="text-amber-400" />
                        Holistic Development
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <ActivitySection title="Certifications" items={student.activities.certifications} />
                        <ActivitySection title="Internships" items={student.activities.internships} />
                        <ActivitySection title="Hackathons" items={student.activities.hackathons} />
                        <ActivitySection title="Sports" items={student.activities.sports} />
                        <ActivitySection title="Extra-curricular" items={student.activities.extracurricular} />
                        <ActivitySection title="Scholarships" items={student.activities.scholarships} />
                    </div>
                </Card>
            )}
        </div>
    );
}

function InfoRow({ label, value, icon }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-2">
                {icon}
                {label}
            </span>
            <span className="text-white">{value}</span>
        </div>
    );
}

function ActivitySection({ title, items }) {
    if (!items || items.length === 0) return null;

    return (
        <div className="p-4 rounded-xl bg-slate-800/50">
            <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
            <div className="space-y-1">
                {items.map((item, index) => (
                    <p key={index} className="text-xs text-slate-400">
                        • {typeof item === 'string' ? item : item.name || item.company || item.event || item.activity || JSON.stringify(item)}
                    </p>
                ))}
            </div>
        </div>
    );
}
