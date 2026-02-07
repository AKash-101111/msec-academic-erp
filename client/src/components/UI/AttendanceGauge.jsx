export default function AttendanceGauge({ percentage, size = 'md' }) {
    const getColor = (pct) => {
        if (pct >= 75) return { stroke: '#10b981', bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
        if (pct >= 60) return { stroke: '#f59e0b', bg: 'bg-amber-500/20', text: 'text-amber-400' };
        return { stroke: '#ef4444', bg: 'bg-red-500/20', text: 'text-red-400' };
    };

    const color = getColor(percentage);
    const sizeClasses = {
        sm: { container: 'w-16 h-16', text: 'text-sm' },
        md: { container: 'w-24 h-24', text: 'text-lg' },
        lg: { container: 'w-32 h-32', text: 'text-2xl' }
    };

    const sizes = sizeClasses[size];
    const radius = size === 'sm' ? 24 : size === 'md' ? 40 : 56;
    const stroke = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className={`relative ${sizes.container} flex items-center justify-center`}>
            <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${radius * 2 + stroke * 2} ${radius * 2 + stroke * 2}`}>
                {/* Background circle */}
                <circle
                    cx={radius + stroke}
                    cy={radius + stroke}
                    r={radius}
                    fill="none"
                    stroke="#334155"
                    strokeWidth={stroke}
                />
                {/* Progress circle */}
                <circle
                    cx={radius + stroke}
                    cy={radius + stroke}
                    r={radius}
                    fill="none"
                    stroke={color.stroke}
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-500 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className={`font-bold ${sizes.text} ${color.text}`}>
                    {percentage?.toFixed(0)}%
                </span>
            </div>
        </div>
    );
}

export function AttendanceBar({ subject, percentage, total, attended }) {
    const color = getStatusColor(percentage);

    return (
        <div className="glass-card p-4">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{subject}</h4>
                <span className={`text-sm font-semibold ${color.text}`}>
                    {percentage?.toFixed(1)}%
                </span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${color.bg.replace('/20', '')}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>
            {total && attended && (
                <p className="text-xs text-slate-400 mt-2">
                    {attended} / {total} classes attended
                </p>
            )}
        </div>
    );
}

function getStatusColor(pct) {
    if (pct >= 75) return { bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
    if (pct >= 60) return { bg: 'bg-amber-500/20', text: 'text-amber-400' };
    return { bg: 'bg-red-500/20', text: 'text-red-400' };
}
