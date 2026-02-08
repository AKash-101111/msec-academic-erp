import { useState, useEffect } from 'react';
import { Trophy, Briefcase, Award, Code, Medal, Star, BookOpen } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { studentAPI } from '../../services/api';

export default function Activities() {
    const [activities, setActivities] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await studentAPI.getActivities();
            if (response.data.success) {
                setActivities(response.data.data.activities);
            }
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-lavender/50 rounded w-48 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 bg-lavender/50 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const sections = [
        { key: 'internships', title: 'Internships', icon: Briefcase, color: 'primary' },
        { key: 'certifications', title: 'Certifications', icon: Award, color: 'accent' },
        { key: 'hackathons', title: 'Hackathons', icon: Code, color: 'purple' },
        { key: 'scholarships', title: 'Scholarships', icon: Star, color: 'amber' },
        { key: 'sports', title: 'Sports', icon: Medal, color: 'red' },
        { key: 'extracurricular', title: 'Extra-curricular', icon: Trophy, color: 'blue' },
        { key: 'ecube', title: 'E-Cube', icon: BookOpen, color: 'teal' }
    ];

    const colorClasses = {
        primary: { bg: 'bg-royal/10', text: 'text-royal', border: 'border-royal/20' },
        accent: { bg: 'bg-amethyst/20', text: 'text-amethyst', border: 'border-amethyst/30' },
        purple: { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/20' },
        amber: { bg: 'bg-amber-500/10', text: 'text-amber-600', border: 'border-amber-500/20' },
        red: { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/20' },
        blue: { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/20' },
        teal: { bg: 'bg-teal-500/10', text: 'text-teal-600', border: 'border-teal-500/20' }
    };

    const hasAnyActivities = sections.some(s =>
        activities?.[s.key] && Array.isArray(activities[s.key]) && activities[s.key].length > 0
    );

    return (
        <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-plum">Activities & Achievements</h1>
                <p className="text-plum/60 mt-1">Your holistic development profile</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {sections.map((section) => {
                    const count = activities?.[section.key]?.length || 0;
                    const colors = colorClasses[section.color];
                    return (
                        <Card key={section.key} className={`text-center ${count > 0 ? colors.border : ''}`}>
                            <div className={`p-2 rounded-lg ${colors.bg} w-fit mx-auto mb-2`}>
                                <section.icon className={`w-5 h-5 ${colors.text}`} />
                            </div>
                            <p className="text-2xl font-bold text-plum">{count}</p>
                            <p className="text-xs text-plum/60">{section.title}</p>
                        </Card>
                    );
                })}
            </div>

            {/* Activity Sections */}
            {hasAnyActivities ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sections.map((section) => {
                        const items = activities?.[section.key];
                        if (!items || !Array.isArray(items) || items.length === 0) return null;

                        const colors = colorClasses[section.color];
                        return (
                            <Card key={section.key}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-2 rounded-lg ${colors.bg}`}>
                                        <section.icon className={`w-5 h-5 ${colors.text}`} />
                                    </div>
                                    <h2 className="text-lg font-semibold text-plum">{section.title}</h2>
                                </div>
                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <ActivityItem key={index} item={item} color={colors} />
                                    ))}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <Trophy className="w-12 h-12 mx-auto text-plum/40 mb-3" />
                    <p className="text-plum/60">No activities recorded yet</p>
                    <p className="text-sm text-plum/50 mt-1">
                        Your internships, certifications, and achievements will appear here
                    </p>
                </Card>
            )}
        </div>
    );
}

function ActivityItem({ item, color }) {
    if (typeof item === 'string') {
        return (
            <div className={`p-3 rounded-lg ${color.bg} border ${color.border}`}>
                <p className="text-plum">{item}</p>
            </div>
        );
    }

    // Object item
    const title = item.name || item.title || item.company || item.event || item.activity || item.project;
    const details = [];

    if (item.role) details.push(item.role);
    if (item.provider) details.push(item.provider);
    if (item.position) details.push(item.position);
    if (item.duration) details.push(item.duration);
    if (item.amount) details.push(item.amount);
    if (item.year) details.push(item.year);

    return (
        <div className={`p-3 rounded-lg ${color.bg} border ${color.border}`}>
            <p className="text-plum font-medium">{title}</p>
            {details.length > 0 && (
                <p className="text-sm text-plum/60 mt-1">{details.join(' • ')}</p>
            )}
        </div>
    );
}
