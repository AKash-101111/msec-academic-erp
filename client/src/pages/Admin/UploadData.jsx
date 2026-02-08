import { useState } from 'react';
import { FileSpreadsheet, BookOpen, Calendar, Trophy } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import FileUpload from '../../components/UI/FileUpload';
import { adminAPI } from '../../services/api';

export default function UploadData() {
    const [activeTab, setActiveTab] = useState('academics');
    const [loading, setLoading] = useState(false);

    const tabs = [
        { id: 'academics', label: 'Academic Marks', icon: BookOpen, description: 'Upload subject marks, unit tests, and IAT scores' },
        { id: 'attendance', label: 'Attendance', icon: Calendar, description: 'Upload subject-wise attendance records' },
        { id: 'activities', label: 'Activities', icon: Trophy, description: 'Upload internships, certifications, hackathons' }
    ];

    const handleUpload = async (file) => {
        setLoading(true);
        try {
            let response;
            switch (activeTab) {
                case 'academics':
                    response = await adminAPI.uploadAcademics(file);
                    break;
                case 'attendance':
                    response = await adminAPI.uploadAttendance(file);
                    break;
                case 'activities':
                    response = await adminAPI.uploadActivities(file);
                    break;
                default:
                    throw new Error('Invalid upload type');
            }
            return response.data;
        } finally {
            setLoading(false);
        }
    };

    const getTemplateInfo = () => {
        switch (activeTab) {
            case 'academics':
                return {
                    columns: ['rollNumber', 'year', 'subjectName', 'marks', 'unitTest1', 'unitTest2', 'unitTest3', 'iatScore', 'gpa'],
                    example: 'Roll No, Year, Subject, Marks, UT1, UT2, UT3, IAT, GPA'
                };
            case 'attendance':
                return {
                    columns: ['rollNumber', 'subjectName', 'attendancePercent', 'totalClasses', 'attendedClasses'],
                    example: 'Roll No, Subject, Attendance %, Total Classes, Attended Classes'
                };
            case 'activities':
                return {
                    columns: ['rollNumber', 'internships', 'certifications', 'hackathons', 'sports', 'extracurricular'],
                    example: 'Roll No, Internships (JSON), Certifications (JSON), ...'
                };
            default:
                return { columns: [], example: '' };
        }
    };

    const template = getTemplateInfo();

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-plum">Upload Data</h1>
                <p className="text-plum/60 mt-1">Import academic records, attendance, and activities from Excel files</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-3">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
              flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200
              ${activeTab === tab.id
                                ? 'bg-royal/10 text-royal border border-royal/20'
                                : 'bg-lavender/50 text-plum/60 hover:text-plum hover:bg-lavender border border-transparent'
                            }
            `}
                    >
                        <tab.icon size={18} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Upload Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-lg font-semibold text-plum mb-2">
                        Upload {tabs.find(t => t.id === activeTab)?.label}
                    </h2>
                    <p className="text-sm text-plum/60 mb-6">
                        {tabs.find(t => t.id === activeTab)?.description}
                    </p>
                    <FileUpload
                        onUpload={handleUpload}
                        loading={loading}
                    />
                </Card>

                <Card>
                    <h2 className="text-lg font-semibold text-plum mb-4 flex items-center gap-2">
                        <FileSpreadsheet className="text-emerald-500" size={20} />
                        File Format Guide
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-plum/80 mb-2">Required Columns</h3>
                            <div className="flex flex-wrap gap-2">
                                {template.columns.map((col) => (
                                    <span key={col} className="px-2 py-1 text-xs rounded-lg bg-lavender/50 text-plum/80 border border-amethyst/30">
                                        {col}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-plum/80 mb-2">Example Format</h3>
                            <div className="p-3 rounded-lg bg-lavender/50 border border-amethyst/30">
                                <code className="text-xs text-emerald-600">{template.example}</code>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                            <h3 className="text-sm font-medium text-amber-600 mb-2">Tips</h3>
                            <ul className="text-xs text-plum/60 space-y-1">
                                <li>• First row should contain column headers</li>
                                <li>• Roll numbers must match existing students</li>
                                <li>• Use standard date formats (YYYY-MM-DD)</li>
                                <li>• Maximum file size: 10MB</li>
                            </ul>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Recent Uploads (Placeholder) */}
            <Card>
                <h2 className="text-lg font-semibold text-plum mb-4">Recent Upload Activity</h2>
                <div className="text-center py-8 text-plum/40">
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No recent uploads</p>
                    <p className="text-sm">Your upload history will appear here</p>
                </div>
            </Card>
        </div>
    );
}
