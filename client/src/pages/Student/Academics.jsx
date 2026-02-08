import { useState, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { studentAPI } from '../../services/api';

export default function Academics() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedYear, setExpandedYear] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await studentAPI.getProfile();
            if (response.data.success) {
                setProfile(response.data.data);
                // Expand the latest year by default
                const years = response.data.data.academics;
                if (years?.length > 0) {
                    setExpandedYear(years[years.length - 1].year);
                }
            }
        } catch (error) {
            console.error('Failed to fetch academics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-lavender/50 rounded w-48 mb-6" />
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-lavender/50 rounded-xl mb-4" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-plum">Academic Records</h1>
                <p className="text-plum/60 mt-1">Year-wise academic performance and subject details</p>
            </div>

            {/* GPA Overview */}
            <Card>
                <h2 className="text-lg font-semibold text-plum mb-4">GPA Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {profile?.academics?.map((year) => (
                        <div
                            key={year.year}
                            className={`
                p-4 rounded-xl text-center cursor-pointer transition-all
                ${expandedYear === year.year
                                    ? 'bg-royal/10 border border-royal/20'
                                    : 'bg-lavender/50 hover:bg-lavender border border-amethyst/20'
                                }
              `}
                            onClick={() => setExpandedYear(expandedYear === year.year ? null : year.year)}
                        >
                            <p className="text-sm text-plum/60">Year {year.year}</p>
                            <p className={`text-3xl font-bold mt-1 ${year.gpa >= 8 ? 'text-emerald-500' :
                                year.gpa >= 6 ? 'text-amber-500' : 'text-red-500'
                                }`}>
                                {year.gpa?.toFixed(2) || '-'}
                            </p>
                            <p className="text-xs text-plum/50 mt-1">{year.subjects?.length || 0} subjects</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Year-wise Details */}
            <div className="space-y-4">
                {profile?.academics?.map((year) => (
                    <Card key={year.year}>
                        <button
                            className="w-full flex items-center justify-between"
                            onClick={() => setExpandedYear(expandedYear === year.year ? null : year.year)}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-royal/10">
                                    <BookOpen className="w-5 h-5 text-royal" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-plum">Year {year.year}</h3>
                                    <p className="text-sm text-plum/60">{year.subjects?.length || 0} subjects</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-2xl font-bold ${year.gpa >= 8 ? 'text-emerald-500' :
                                    year.gpa >= 6 ? 'text-amber-500' : 'text-red-500'
                                    }`}>
                                    GPA: {year.gpa?.toFixed(2) || '-'}
                                </span>
                                {expandedYear === year.year ? (
                                    <ChevronUp className="text-plum/40" />
                                ) : (
                                    <ChevronDown className="text-plum/40" />
                                )}
                            </div>
                        </button>

                        {expandedYear === year.year && year.subjects && (
                            <div className="mt-6 border-t border-amethyst/20 pt-6">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="text-left text-xs text-plum/60 uppercase">
                                                <th className="pb-3">Subject</th>
                                                <th className="pb-3 text-center">UT 1</th>
                                                <th className="pb-3 text-center">UT 2</th>
                                                <th className="pb-3 text-center">UT 3</th>
                                                <th className="pb-3 text-center">IAT</th>
                                                <th className="pb-3 text-center">Final</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {year.subjects.map((subject, idx) => (
                                                <tr key={idx} className="border-t border-amethyst/10">
                                                    <td className="py-3 text-plum">{subject.subjectName}</td>
                                                    <td className="py-3 text-center text-plum/80">{subject.unitTest1?.toFixed(0) || '-'}</td>
                                                    <td className="py-3 text-center text-plum/80">{subject.unitTest2?.toFixed(0) || '-'}</td>
                                                    <td className="py-3 text-center text-plum/80">{subject.unitTest3?.toFixed(0) || '-'}</td>
                                                    <td className="py-3 text-center text-plum/80">{subject.iatScore?.toFixed(0) || '-'}</td>
                                                    <td className={`py-3 text-center font-semibold ${subject.marks >= 80 ? 'text-emerald-500' :
                                                        subject.marks >= 60 ? 'text-amber-500' : 'text-red-500'
                                                        }`}>
                                                        {subject.marks?.toFixed(0) || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>

            {(!profile?.academics || profile.academics.length === 0) && (
                <Card className="text-center py-12">
                    <BookOpen className="w-12 h-12 mx-auto text-plum/40 mb-3" />
                    <p className="text-plum/60">No academic records available</p>
                </Card>
            )}
        </div>
    );
}
